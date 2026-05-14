import React from 'react';
import LoggedNavBar from '../components/LoggedNavBar';
import MiniHero from '../components/MiniHero';
import Footer from '../components/Footer';
import {Form, Button}  from 'react-bootstrap';
import ChangeTextModalSingleText from '../page_elements/UserPage/ChangeTextModalSingleText';
import InfoModal from '../page_elements/UserPage/InfoModal';
import PasswordModal from '../page_elements/UserPage/PasswordModal';
import PhotoModal from '../page_elements/UserPage/PhotoModal';
import AddressModal from '../page_elements/UserPage/AddressModal';
import { useState, useEffect } from 'react';
import { CURRENT_USER, USERS_COMPANY, PHOTOS } from '../constants';
import api from '../api';
import { RetrievePhotos, manageSpotifyArtists } from '../globalFuns';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function UserPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const user = JSON.parse(localStorage.getItem(CURRENT_USER));
    const company = JSON.parse(localStorage.getItem(USERS_COMPANY));
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const photo = company ? photos?.find(
        item => item.id === company.companyPhoto
    ) : null;
    const photoSource = company && photo
        ? `${import.meta.env.VITE_API_URL}${photo.image}`
        : null;
    const [loading, setLoading] = useState(false)
    const emailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    const [showChangeEmailModal, setshowChangeEmailModal] = useState(false);
    const handleShowChangeEmailModal = () => {
        setshowChangeEmailModal(true);
    };
    const closeChangeEmailModal = () =>{
        setshowChangeEmailModal(false);       
    };
    const [newEmail, setNewEmail] = useState(user.email);
    const handleNewEmail = (e) => {
        setNewEmail(e.target.value)
    };
    const [emailError, setEmailError] = useState("");
    const handleEmailError = () =>{
        if(!newEmail || !emailRegex.test(newEmail)){
            setEmailError("")
        }else{
            setEmailError("");
            closeChangeEmailModal();
        }
    };
    //company name
    const companyNameRegex = /^\S.{0,50}\S$/;
    const [showChangeCompanyNameModal, setshowChangeCompanyNameModal] = useState(false);
    const handleShowChangeCompanyNameModal = () => {
        setshowChangeCompanyNameModal(true);
    };
    const closeChangeCompanyNameModal = () =>{
        setshowChangeCompanyNameModal(false);       
    };
    const [newCompanyName, setNewCompanyName] = useState(company ? company.name : "");
    const handleNewCompanyName = (e) => {
        setNewCompanyName(e.target.value)
    };
    const [companyNameError, setCompanyNameError] = useState("");
    const updateCompany = async (photoId) => {
        if (!company) return
        try {
            setLoading(true)
            const payload = {name: company.name, address: company.address, companyPhoto: photoId}
            const response = await api.patch(`/api/update_company/`, payload);

            if (response.status === 200 || response.status === 201) {
                console.log("updated successfully");
                return "";
            }

            return response.data?.error || "Nieznany błąd";
        } catch (err) {
            return err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania";
        }finally{
            setLoading(false)
        }
    };
    const handleCompanyNameError = async () =>{
        if (!company) return
        if(!newCompanyName || !companyNameRegex.test(newCompanyName)){
            setCompanyNameError("Nazwa może mieć co najwyżej 50 znaków")
        }else{
            setLoading(true)
            company.name = newCompanyName
            const error = await updateCompany();
            if (error) {
                setCompanyNameError(error);
                return;
            }
            localStorage.setItem(USERS_COMPANY, JSON.stringify(company));
            closeChangeCompanyNameModal();
            setLoading(false)
            location.reload();
        }
    };
    //Info Modal
    const [showSpotify, setShowSpotify] = useState(false);
    const handleShowSpotify = async() => {
        setShowSpotify(true);
        const res  = await api.post("/api/spotify/login/")
        const data = res.data;
        window.location.href = data.url;
    };
    const refreshArtists = async() => {
        try{
            const response = await api.get(`/api/spotify/get_top_artist/`)
            if(response.status === 200 || response.status === 201){
                await manageSpotifyArtists(response.data, user)
            }
        }catch(err){
            console.log("cos poszlo nie tak " + err)
        }
    }
    const closeShowSpotify = () => {
        setShowSpotify(false);
    }
    // Password Modal
    const passwordRegex = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).{8,}$");
    const [showChangePasswordModal, setshowChangePasswordModal] = useState(false);
    const handleShowChangePasswordModal = () => {
        setshowChangePasswordModal(true);
    };
    const closeChangePasswordModal = () =>{
        setshowChangePasswordModal(false);       
    };
    const [oldPassword, setOldPassword] = useState("");
    const handleOldPassword= (e) => {
        setOldPassword(e.target.value)
    };
    const [newPassword, setNewPassword] = useState("");
    const handleNewPassword = (e) => {
        setNewPassword(e.target.value)
    };
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const handleNewPasswordRepeat = (e) => {
        setNewPasswordRepeat(e.target.value)
    };
    const [passwordError, setPasswordError] = useState("");
    const handlePasswordError = () =>{
        if(!newPassword || !oldPassword || !newPasswordRepeat){
            setPasswordError("Wszystkie pola powinny być uzupełnione")          
        }else if(!passwordRegex.test(newPassword)){
            setPasswordError("Nowe hasło powinno zawierać co najmniej 8 cyfr, co najmniej jedną cyfrę, co najmniej jedną dużą literę oraz co najmniej jeden znak specjalny (@,!,? itd.)")
        }else if(newPassword != newPasswordRepeat){
            setPasswordError("Nowe hasło i powtórzone nowe hasło powinny być takie same")
        }else{
            setPasswordError("");
            closeChangePasswordModal();
        }
    };
    //Photo modal
    const [showCompanyPhotoModal, setShowCompanyPhotoModal] = useState(false);
    const handleShowCompanyPhotoModal = () => {
        setShowCompanyPhotoModal(true);
    };
    const closeShowCompanyPhotoModal = () => {
        setShowCompanyPhotoModal(false);
    };
    const [companyPhoto, setCompanyPhoto] = useState(null);
    const [companyPhotoError, setCompanyPhotoError] = useState("");
    const uploadPhoto = async () => {
        if (!company) return
        try{
            setLoading(true)
            const formData = new FormData();
            formData.append("image", companyPhoto);
            formData.append("companyImage", company.id);

            const response = await api.post(
                "/api/upload_photo/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if(response.status === 200 || response.status === 201){
                await RetrievePhotos();
                return response.data.id
            }else{
                return 0
            }
        }catch(err){
            return 0;
        }finally{
            setLoading(false)
        }
    }
    const handleCompanyPhotoError = async () =>{
        if (!company) return
        if(!companyPhoto){
            setCompanyPhotoError("Brak zdjęcia");
        }else{
            const photoId = await uploadPhoto()
            if(photoId < 1){
                setCompanyPhotoError("Coś poszło nie tak")
                return
            }
            const updateError = await updateCompany(photoId)
            if(updateError){
                setCompanyPhotoError(updateError)
                return
            }
            const updatedCompany = {
                ...company,
                companyPhoto: photoId
            }
            localStorage.setItem(USERS_COMPANY, JSON.stringify(updatedCompany))
            closeShowCompanyPhotoModal();
            location.reload();
        }
    };
    const [preview, setPreview] = useState(photoSource)
    const handleCompanyPhoto = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setCompanyPhoto(file);
            setPreview(URL.createObjectURL(file)); 
            setCompanyPhotoError("");
        }else{
            setCompanyPhotoError("Przesłany plik nie jest zdjęciem")
        }
    };
    //address
    const townRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/;
    const zipCodeRegex = /^[0-9]{2}-[0-9]{3}$/
    const streetRegex = /(?:ul\.|ulica|al\.|pl\.)\s+([A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż\s\-]+)\s+(\d+[a-zA-Z]?)(?:\/\d+)?/
    const joinAddress = (town, street, zipcode) => {
        return `${street}, ${zipcode} ${town}`
    }
    const[street, setStreet] = useState("ul.")
    const[isStreetCorrect, setIsStreetCorrect] = useState(true);
    const checkIsStreetCorrect = (value) =>{
        const isValid = streetRegex.test(value);
        setIsStreetCorrect(isValid)
    }
    const handleStreet = (e) =>{
        const value = e.target.value;
        setStreet(value)
        checkIsStreetCorrect(value)
    } 
    const[town, setTown] = useState("")
    const[isTownCorrect, setIsTownCorrect] = useState(true)
    const checkIsTownCorrect = (value) => {
        const isValid = townRegex.test(value);
        setIsTownCorrect(isValid)
    }
    const handleTown = (e) =>{
        const value = e.target.value;
        setTown(value)
        checkIsTownCorrect(value)
    }
    const [zipCode, setZipCode] = useState("")
    const [isZipCodeCorrect, setIsZipCodeCorrect] = useState(true)
    const checkIsZipCodeCorrect = (value) =>{
        const isValid = zipCodeRegex.test(value);
        setIsZipCodeCorrect(isValid)
    }
    const handleZipCode = (e) => {
        const value = e.target.value
        setZipCode(value)
        checkIsZipCodeCorrect(value)
    }
    const [showAddressModal, setshowAddressModal] = useState(false);
    const handleShowAddressModal = () => {
        setshowAddressModal(true);
    };
    const closeAddressModal = () =>{
        setshowAddressModal(false);       
    };
    const[addressError, setAddressErrror] = useState("");
    const handleAddressError = async () => {
        if (!company) return
        if(!isStreetCorrect){
            setAddressErrror("Błędna ulica (proszę wpisać ul. lub al., nazwę ulicy oraz numer lokalu)")
            return;
        }
        else if(!isTownCorrect){
            setAddressErrror("Błędna nazwa miejscowości")
            return;
        }
        else if(!isZipCodeCorrect){
            setAddressErrror("Błędny kod pocztowy (np. 12-345)")
            return;
        }
        else{
            company.address = joinAddress(town, street, zipCode);
            const error = await updateCompany();
            if(error){
                setAddressErrror(error)
                return;
            }
            localStorage.setItem(USERS_COMPANY, JSON.stringify(company));
            closeAddressModal();
            location.reload();
        }
    }
    return(
        <>
        <header>
            <LoggedNavBar/> 
        </header>
        <nav>
            <LoggedMenuOffcanvas/>
        </nav>
        <main>
            <section>
                <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={false} 
                    subheadingDisplayed={true}
                    headingText="Twoje konto" 
                    subheadingText = " " />
            </section>
            <section>
            <h2 className="slider-heading">Twoje konto</h2>
            <div className="user-page-container">
                <div className="user-info-container">
                    <div className="user-info-box-big">
                        <img src="/account-lime.svg" height="80px"/>
                        <div>                    
                            <p className="bold">{user.username}</p>
                        </div>
                        <div>                    
                            <p className="bold">e-mail</p>
                        </div>
                        <p>{newEmail}</p>
                        <p className="bold">Data dołączenia</p>
                        <p>09.04.2026</p>
                    </div>
                </div>
                <div className="user-info-container">
                    <div className="user-info-box-small">
                        <p className="bold">Obserwowani:</p>
                        <Button href="/#/followed_artists"className="user-info-button">Obserwowani artyści</Button>
                        <Button href="/#/followed_companies" className="user-info-button">Obserwowani organizatorzy</Button>
                        <Button className="user-info-button" onClick={user.hasSpotify ? refreshArtists : handleShowSpotify}>{user.hasSpotify ? "Zakutalizuj ulubionych artystów" : "Połącz swoje konto spotify"}</Button>
                    </div>
                    <div className="user-info-box-small">
                        <p className="bold">Wydarzenia:</p>
                        <Button href="/#/user_event_list" className="user-info-button">Obserwowane</Button>
                        <Button href="/#/user_history_event_list" className="user-info-button">Historia</Button>
                    </div>
                </div>
            </div>
            </section>
            <section>
            <h2 className="slider-heading" style={{display: company ? 'block' : 'none'}}>{company !== null ? company.name : ""}</h2>
            <div className="user-page-container" style={{display: company ? 'flex' : 'none'}}>
                <div className="user-info-container">
                    <div className="user-info-box-big">
                        <img src="/building-lime.svg" height="80px"/>
                        <div>                    
                            <p className="bold">{company ? company.name : ""}</p>
                            <a tabIndex="0" onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleShowChangeCompanyNameModal();
                                                        }
                                                    }} onClick={handleShowChangeCompanyNameModal}>{user.companyRole === "Owner" && <img src="/edit-lime.svg" alt="edytuj nazwę firmy"/>}</a>
                        </div>                 
                        <p className="bold">NIP</p>
                        <p>{company ? company.nipNumber : ""}</p>
                        <div>                    
                            <p className="bold">Adres</p>
                            <a tabIndex="0" onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleShowAddressModal();
                                                        }
                                                    }} onClick={handleShowAddressModal}>{user.companyRole === "Owner" &&<img src="/edit-lime.svg" alt="edytuj adres firmy"/>}</a>
                        </div>
                        <p>{company ? company.address : ""}</p>
                        <Button className="event-card-button w-50" href="/#/employees_page">Pracownicy</Button>
                    </div>
                </div>
                <div className="user-info-container">
                    <div className="user-info-box-small">
                        <div>
                            <p className="bold">Zdjęcie</p>
                            <a tabIndex="0" onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleShowCompanyPhotoModal();
                                                        }
                                                    }}onClick={handleShowCompanyPhotoModal}>{user.companyRole === "Owner" &&<img src="/edit-lime.svg"/>}</a>
                        </div>
                        <img className="company-photo"src={preview}/>
                    </div>
                    <div className="user-info-box-small">
                        <p className="bold">Wydarzenia:</p>
                        <Button href="/#/company_event_list" className="user-info-button">Aktualne</Button>
                        <Button href="/#/company_history_event_list" className="user-info-button">Historia</Button>
                        <Button href="/#/event_create" className="user-info-button">Dodaj nowe wydarzenie</Button>
                    </div>
                </div>
            </div>
            </section>
            <ChangeTextModalSingleText
                modalShow={showChangeEmailModal}
                handleClose={closeChangeEmailModal}
                modalHeading="Zmień e-mail"
                modalInstruction="Podaj nowy e-mail"
                inputType="email"
                inputValue={newEmail}
                handleUserInput = {handleNewEmail}
                errorMessage = {emailError}
                handleErrorMessage={handleEmailError}
            />
            <ChangeTextModalSingleText
                modalShow={showChangeCompanyNameModal}
                handleClose={closeChangeCompanyNameModal}
                modalHeading="Zmień nazwę firmy"
                modalInstruction="Podaj nową nazwę"
                inputType="text"
                inputValue={newCompanyName}
                handleUserInput = {handleNewCompanyName}
                errorMessage = {companyNameError}
                handleErrorMessage={handleCompanyNameError}
                loading={loading}
                />
            <InfoModal
                modalShow={showSpotify}
                handleClose={closeShowSpotify}/>
            <PasswordModal
                modalShow={showChangePasswordModal}
                handleClose={closeChangePasswordModal}
                oldPasswordValue={oldPassword}
                handleOldPassword={handleOldPassword}
                newPasswordValue={newPassword}
                handleNewPassword={handleNewPassword}
                newPasswordRepeatValue={newPasswordRepeat}
                handleNewPasswordRepeat={handleNewPasswordRepeat}
                errorMessage={passwordError}
                handleErrorMessage={handlePasswordError}
                />
            <PhotoModal
                modalShow={showCompanyPhotoModal}
                handleClose={closeShowCompanyPhotoModal}
                fileSource={preview}
                errorMessage={companyPhotoError}
                handleErrorMessage={handleCompanyPhotoError}
                handlePhotoChange={handleCompanyPhoto}
                loading={loading}
                />
            <AddressModal
                modalShow={showAddressModal}
                handleClose={closeAddressModal}
                modalHeading="Zmień adres"
                inputTypeStreet="text"
                inputValueStreet={street}
                handleUserInputStreet = {handleStreet}
                inputTypeTown="text"
                inputValueTown={town}
                handleUserInputTown = {handleTown}
                inputTypeZipCode="text"
                inputValueZipCode={zipCode}
                handleUserInputZipCode = {handleZipCode}
                errorMessage = {addressError}
                handleErrorMessage={handleAddressError}
                loading={loading}
            />
        </main>
        <Footer/>
        </>
    );
}
export default UserPage;
