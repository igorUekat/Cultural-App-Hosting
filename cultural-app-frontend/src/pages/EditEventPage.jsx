import React from "react";
import LoggedNavbar from '../components/LoggedNavBar'
import MiniHero from '../components/MiniHero';
import Footer from '../components/Footer';
import { InputGroup, Form, Dropdown, Button, Badge, Alert, Spinner, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import ArtistListModal from "../page_elements/EventCreate/ArtistListModal";
import ArtistCard from "../components/ArtistCard";
import { RetrieveArtists, RetrieveEvents, RetrievePhotos, RetrieveNotifications, RetrieveLocation, RetrieveEventArtists } from "../globalFuns";
import { USERS_COMPANY, CURRENT_USER, PHOTOS, EVENTS, EVENT_ARTISTS, ARTISTS } from "../constants";
import api from "../api";
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoggedMenuOffcanvas from "../components/LoggedMenuOffcanvas";
function EditEventPage(props){
    useEffect(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const company = JSON.parse(localStorage.getItem(USERS_COMPANY))
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a, b) => a.id - b.id)
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const { id } = useParams(); 
    const currentEvent = JSON.parse(localStorage.getItem(EVENTS)).find(item => item.id === Number(id))
    const [eventArtists, setEventArtists] = useState(currentEvent.artists)
    if(!currentEvent.everyoneCanEdit && currentEvent.company === user.company && currentEvent.createdBy !== user.id){
        return <div>Nie masz wstępu do tej strony</div>
    }
    const [eventName, setEventName] = useState(currentEvent.name);
    const handleEventName = (e) =>{
        setEventName(e.target.value);
    }
    const townRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/;
    const streetRegex = /(?:ul\.|ulica|al\.|pl\.)\s+([A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż\s\-]+)\s+(\d+[a-zA-Z]?)(?:\/\d+)?/
    const [voivod, setVoivod] = useState(currentEvent.placeVoivod);
    const [voivodCorrect, setVoivodCorrect] = useState(true);
    const checkVoivod = (value) => {
        setVoivodCorrect(value && value != "Województwo:")
    }
    const selectVoivod = (value) => {
        setVoivod(value);
        checkVoivod(value);
    };
    const [townName, setTownName] = useState(currentEvent.placeTown);
    const [townCorrect, setTownCorrect] = useState(true)
    const checkTownCorrect = (value) =>{
        const isValid = townRegex.test(value)
        setTownCorrect(isValid)
    }
    const handleTownInput = (e) =>{
        const value = e.target.value
        setTownName(value);
        checkTownCorrect(value);
    };
    const [street, setStreet] = useState(currentEvent.placeStreet);
    const [streetCorrect, setStreetCorrect] = useState(true)
    const checkStreetCorrect = (value) =>{
        const isValid = streetRegex.test(value)
        setStreetCorrect(isValid)
    }
    const handleStreetInput = (e) =>{
        const value = e.target.value;
        setStreet(value)
        checkStreetCorrect(value)
    };
    const [venueName, setVenueName] = useState(currentEvent.placeName);
    const handleVenueNameInput = (e) =>{
        setVenueName(e.target.value);
    };
    const [showTickets, setShowTickets] = useState(false);
    const handleShowTickets = (e) =>{
        setShowTickets(e.target.checked)
    }
    const [showConcession, setShowConcession] = useState(false);
    const handleShowConcession = (e) =>{
        setShowConcession(e.target.checked)
    }
    const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const [eventTicketsLink, setEventTicketsLink] = useState(currentEvent.link);
    const [eventTicketsLinkCorrect, setEventTicketsLinkCorrect] = useState(true);
    const checkEventTicketsLinkCorrect = (value) =>{
        const isValid = value ? linkRegex.test(value) : true
        setEventTicketsLinkCorrect(isValid)
    }

    const handleEventTicketsLinkInput = (e) =>{
        const value = e.target.value;
        setEventTicketsLink(value)
        checkEventTicketsLinkCorrect(value)
    };
    const [cheapTicketPrice, setCheapTicketPrice] = useState(`${currentEvent.lowestPriceNorm}`);
    const [expensiveTicketPrice, setExpensiveTicketPrice] = useState(`${currentEvent.highestPriceNorm}`);
    const [cheapConcessionTicketPrice, setCheapConcessionTicketPrice] = useState(`${currentEvent.lowestPriceCon}`);
    const [expensiveConcessionTicketPrice, setExpensiveConcessionTicketPrice] = useState(`${currentEvent.highestPriceCon}`);
    const handleNumbers = (value) => {
        if(value === ""){
            return 0;
        }
        const number = Number(value);
        if (isNaN(number) || number < 0) return 0;
        return number
    }
    const handleCheapTicketPrice = (e) => {
        const value = e.target.value;
        setCheapTicketPrice(value)
    }
    const handleExpensiveTicketPrice = (e) => {
        const value = e.target.value;
        setExpensiveTicketPrice(value)
    }
    const handleConcessionCheapTicketPrice = (e) => {
        const value = e.target.value;
        setCheapConcessionTicketPrice(value)
    }
    const handleConcessionExpensiveTicketPrice = (e) => {
        const value = e.target.value;
        setExpensiveConcessionTicketPrice(value)
    }
    const compare = (cheap, expensive) => {
        return handleNumbers(cheap) <= handleNumbers(expensive)
    }
    const [firstDate, setFirstDate] = useState(currentEvent.date.split("T")[0]);
    const [secondDate, setSecondDate] = useState(currentEvent.dateSecond.split("T")[0]);
    const handleFirstDate = (e) => {
            setFirstDate(e.target.value);
            setSecondDate(e.target.value);
    };
    const handleSecondDate = (e) => {
            setSecondDate(e.target.value);
    };
    const [showSecondDate, setShowSecondDate] = useState(false);
    const handleShowSecondDate = (e) => {
        setShowSecondDate(e.target.checked);
        if(!e.target.checked){
            setSecondDate(firstDate);
        }
    };
    const compareDates = (date1, date2) => {
        return new Date(date1) <= new Date(date2)
    }
    const notInThePast = (date) => {
        const now = new Date()
        return new Date(date) >= now
    }
    const eventPhotoGallery = photos.filter(item => item.eventImage === currentEvent.id)
    const [eventPhoto, setEventPhoto] = useState(null);
    const [eventPhotoPreview, setEventPhotoPreview] = useState(`${import.meta.env.VITE_API_URL}${eventPhotoGallery[0].image}`)
    const handleEventPhoto = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setEventPhoto(file);
            setEventPhotoPreview(URL.createObjectURL(file)); 
        }
    };
    const additionalPhotos = eventPhotoGallery.slice(1, eventPhotoGallery.length)
    const additionalPhotosFiles = additionalPhotos.map(item => `${import.meta.env.VITE_API_URL}${item.image}`)
    const [addedPhoto, setAddedPhoto] = useState(null);
    const [addedPhotoFile, setAddedPhotoFile] = useState(null);
    const handleAddedPhoto = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAddedPhotoFile(URL.createObjectURL(file));
            setAddedPhoto(file);
        }
    }
    const [newImages, setNewImages] = useState([]);
    const [galleryImages, setGalleryImages] = useState(additionalPhotos);
    const [galleryImagesFiles, setGalleryImagesFiles] = useState(additionalPhotosFiles);
    const handleGalleryImages = () =>{
        if(addedPhoto){
            setGalleryImages([...galleryImages, addedPhoto]);
            setGalleryImagesFiles([...galleryImagesFiles, addedPhotoFile]);
            setNewImages([...newImages, addedPhoto])
            setAddedPhoto(null);
            setAddedPhotoFile(null);
            const fileInput = document.getElementById('formFile');
            if (fileInput) fileInput.value = '';
        }
    }
    const [eventType, setEventType] = useState('Rodzaj');
    const [genreContent, setGenreContent] = useState(<></>);
    const [eventGenre, setEventGenre] = useState('Gatunek');
    const handleTypeSelection = (value) => {
        setEventGenre("Gatunek");
        const theType  = value;
        if(theType === 'Muzyczne'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Pop">Pop</Dropdown.Item>
                    <Dropdown.Item eventKey="Rock">Rock</Dropdown.Item>
                    <Dropdown.Item eventKey="Metal">Metal</Dropdown.Item>
                    <Dropdown.Item eventKey="Muzyka elektroniczna">Muzyka elektroniczna</Dropdown.Item>
                    <Dropdown.Item eventKey="Filharmonia">Filharmonia</Dropdown.Item>
                    <Dropdown.Item eventKey="Country">Country</Dropdown.Item>
                    <Dropdown.Item eventKey="Blues">Blues</Dropdown.Item>
                    <Dropdown.Item eventKey="Disco">Disco</Dropdown.Item>
                    <Dropdown.Item eventKey="Rap">Rap</Dropdown.Item>
                    <Dropdown.Item eventKey="Jazz">Jazz</Dropdown.Item>
                    <Dropdown.Item eventKey="Alternatywa">Alternatywa</Dropdown.Item>
                </Dropdown.Menu>    
            );
        }else if(theType === 'Sportowe'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Piłka nożna">Piłka nożna</Dropdown.Item>
                    <Dropdown.Item eventKey="Siatkówka">Siatkówka</Dropdown.Item>
                    <Dropdown.Item eventKey="Hokej na lodzie">Hokej na lodzie</Dropdown.Item>
                    <Dropdown.Item eventKey="Żużel">Żużel</Dropdown.Item>
                    <Dropdown.Item eventKey="Skoki narciarskie">Skoki narciarskie</Dropdown.Item>
                    <Dropdown.Item eventKey="Sporty walki">Sporty walki</Dropdown.Item>
                    <Dropdown.Item eventKey="Koszykówka">Koszykówka</Dropdown.Item>
                    <Dropdown.Item eventKey="Piłka ręczna">Piłka ręczna</Dropdown.Item>
                    <Dropdown.Item eventKey="Rugby">Rugby</Dropdown.Item>
                </Dropdown.Menu>    
            ); 
        }else if(theType === 'Spektakle'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Komedia">Komedia</Dropdown.Item>
                    <Dropdown.Item eventKey="Tragedia">Tragedia</Dropdown.Item>
                    <Dropdown.Item eventKey="Melodramat">Melodramat</Dropdown.Item>
                    <Dropdown.Item eventKey="Adaptacja">Adaptacja</Dropdown.Item>
                    <Dropdown.Item eventKey="Musical">Musical</Dropdown.Item>
                </Dropdown.Menu>    
            );
        }else if(theType === 'Plenerowe'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Festiwale muzyczne">Festiwale muzyczne</Dropdown.Item>
                    <Dropdown.Item eventKey="Festyny">Festyny</Dropdown.Item>
                    <Dropdown.Item eventKey="Jarmarki">Jarmarki</Dropdown.Item>
                </Dropdown.Menu>
            );   
        }else if(theType ==='Muzealne'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Wystawa">Wystawa</Dropdown.Item>
                    <Dropdown.Item eventKey="Wernisaż/Finisaż">Wernisaż/Finisaż</Dropdown.Item>
                </Dropdown.Menu>
            );  
        }else if(theType === 'Konwenty'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Komiksy">Komiksy</Dropdown.Item>
                    <Dropdown.Item eventKey="Technologia">Technologia</Dropdown.Item>
                </Dropdown.Menu> 
            );       
        }
        setEventType(theType);
    }
    const handleEventGenre = (value) =>  {
        setEventGenre(value);
    }
    const[secondaryTag, setSecondaryTag] = useState("");
    const handleSecondaryTag = (e) =>{
        setSecondaryTag(e.target.value);
    }
    function onlyUnique(value, index, array){
        return array.indexOf(value) === index;
    }
    const eventTags = currentEvent.tags.split(";").map(item => ({name: item.split(":")[0], type: item.split(":")[1]}))
    const [primaryTagGroup, setPrimaryTagGroup] = useState(eventTags.filter(item => item.type === "primary").map(item => item.name));
    const handlePrimaryTagGroup = () =>{
        if(eventGenre && eventGenre !== "Gatunek"){
            setPrimaryTagGroup(prevTags => {
                const newTags = [...primaryTagGroup, eventGenre]
                const unique = newTags.filter(onlyUnique)
                return unique
            })
            setEventGenre("Gatunek");
        }
    }
    const deleteFromPrimary = (target) => {
        setPrimaryTagGroup(prev =>
            prev.filter(item => item !== target)
        );
    };
    const [secondaryTagGroup, setSecondaryTagGroup] = useState(eventTags.filter(item => item.type === "secondary").map(item => item.name));;
    const handleSecondaryTagGroup = ()=>{
        if(secondaryTag){
            setSecondaryTagGroup(prevTags => {
                const newTags = [...secondaryTagGroup, secondaryTag]
                const unique = newTags.filter(onlyUnique)
                return unique;
            })
            setSecondaryTag("");
            const fileInput = document.getElementById('secondaryForm');
            if (fileInput) fileInput.value = '';           
        }
    }
    const deleteFromSecondary = (target) => {
        setSecondaryTagGroup(prev =>
            prev.filter(item => item !== target)
        );
    };
    const [showArtistModal, setShowArtistModal] = useState(false);
    const handleShowArtistModal = () => {
        setShowArtistModal(true);
    }
    const closeArtistModal = () => {
        setShowArtistModal(false)
    }
    const [newArtistName, setNewArtistName] = useState("")
    const handleNewArtistName = (e) => {
        setNewArtistName(e.target.value);
    }
    const [addedArtists, setAddedArtists] = useState([])
    const [deletedArtists, setDeletedArtists] = useState([])
    const [newArtistPhoto, setNewArtistPhoto] = useState(null);
    const [newArtistPhotoFile, setNewArtistPhotoFile] = useState(null)
    const handleNewArtistPhoto = (e) =>{
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setNewArtistPhotoFile(file);
            setNewArtistPhoto(URL.createObjectURL(file));
        }
    }
    const [newArtistErrorMessage, setNewArtistErrorMessage] = useState("");
    const [artistGroup, setArtistGroup] = useState(artists.filter(item => eventArtists.includes(item.id)));
    const handleNewArtistErrorMessage = () => {
        if(!newArtistName || !newArtistPhoto){
            setNewArtistErrorMessage("Profil artysty powinien zawierać nazwę oraz zdjęcie");
            return;
        }else{
            const artist = { name: newArtistName, photoOfArtist: newArtistPhoto, id:0, photoFile: newArtistPhotoFile};
            setArtistGroup(prev => [...prev, artist]);
            setNewArtistName("");
            setNewArtistPhoto(null);
            setNewArtistPhotoFile(null);
            setNewArtistErrorMessage("");
            closeArtistModal();
        }
    }
    const deleteFromArtists = (target, id) => {
        setArtistGroup(prev =>
            prev.filter(item => item.name !== target)
        );
        setDeletedArtists(prev => [...prev, {name: target, id: id}])
    };
    const artistCardButtonFunction = (name, photoOfArtist, id) => {
        const artist = {name, photoOfArtist, id, photoFile: null};
        console.log(artist)
        setArtistGroup(prev => [...prev, artist]);
        setAddedArtists(prev => [...prev, {name: name, id: id}])
        setNewArtistName("");
        setNewArtistPhoto(null);
        setNewArtistErrorMessage("");
        closeArtistModal();
    }

    const [eventDescription, setEventDescription] = useState(currentEvent.description)
    const handleEventDescritption = (e) => {
        setEventDescription(e.target.value);
    }
    const [eventAdditional, setEventAdditional] = useState(currentEvent.additionalInfo)
    const handleEventAdditional = (e) => {
        setEventAdditional(e.target.value);
    }
    const [canEveryoneEdit, setCanEveryoneEdit] = useState(currentEvent.canEveryoneEdit);
    const handleCanEveryoneEdit = (e) => {
        setCanEveryoneEdit(e.target.checked)
    }
    function CreateTagString(array1,array2){
        var tags = "";
        array1.forEach((tag) =>{
            tags += `${tag}:primary;`
        })
        array2.forEach((tag) =>{
            tags += `${tag}:secondary;`
        })
        return tags;
    }
    const[loading, setLoading] = useState(false);
    const[errorMessage, setErrorMessage] = useState("")
    const[createdEventId, setCreatedEventId] = useState(0)
    const[createdArtistId, setCreatedArtistId] = useState(0)
    const[longitude, setLongitude] = useState(0)
    const[latitude, setLatitude] = useState(0)
    async function GetLocation(town, voivod, retries = 2){
        for (let i = 0; i < retries; i++) {
            try {
                const location = await RetrieveLocation(town, voivod);
                if (location && location.lat && location.lon) {
                    return location;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1} failed:`, error.message);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    const handleSubmition = async (e) => {
        e.preventDefault()
        if(
            !eventName ||
            !firstDate ||
            !secondDate ||
            !compareDates(firstDate, secondDate) ||
            !notInThePast(firstDate) ||
            !notInThePast(secondDate) ||
            !venueName ||
            !street ||
            !streetCorrect ||
            !townName ||
            !voivodCorrect ||
            !eventTicketsLinkCorrect ||
            !compare(cheapTicketPrice, expensiveTicketPrice) ||
            !compare(cheapConcessionTicketPrice, expensiveConcessionTicketPrice) ||
            !eventDescription
        ){
            setErrorMessage("Nie wszystkie pola zostały poprawnie wypełnione. Postępuj zgodnie z ostrzeżeniami")
        }else{
            try{
                setLoading(true);
                const tags = CreateTagString(primaryTagGroup, secondaryTagGroup);
                const location = await GetLocation(townName, voivod)
                const lon = location.lon
                const lat = location.lat
                const payload = {
                    company: company.id,
                    name: eventName,
                    date: new Date(firstDate).toISOString(),
                    dateSecond: new Date(secondDate).toISOString(),
                    placeName: venueName,
                    placeStreet: street,
                    placeTown: townName,
                    placeVoivod: voivod,
                    link: eventTicketsLink,
                    lowestPriceNorm: handleNumbers(cheapTicketPrice),
                    highestPriceNorm: handleNumbers(expensiveTicketPrice),
                    isCon: showConcession,
                    lowestPriceCon: handleNumbers(cheapConcessionTicketPrice),
                    highestPriceCon: handleNumbers(expensiveConcessionTicketPrice),
                    description: eventDescription,
                    additionalInfo: eventAdditional,
                    everyoneCanEdit: canEveryoneEdit,
                    createdBy: user.id,
                    tags: tags,
                    longitude: parseFloat(lon).toFixed(5),
                    latitude: parseFloat(lat).toFixed(5)
                }
                const eventResponse = await api.put(`/api/update_event/${currentEvent.id}/`, payload);
                if(eventResponse.status==200 || eventResponse.status==201){
                    await RetrieveEvents()
                    const clearResponse = await api.delete(`/api/clear_event_artists/${currentEvent.id}/`);
                    if(clearResponse.status!==200 && clearResponse.status!==201){
                        setErrorMessage(clearResponse.data?.error || "Nieznany błąd");
                        return;
                    }
                    for (const artist of artistGroup) {
                        let artistId;
                        if(artist.id === 0){
                            const formData = new FormData()
                            formData.append("name", artist.name)
                            formData.append("createdBy", company.id)
                            formData.append("photoFile", artist.photoFile)
                            const newArtistResponse = await api.post('/api/create_artist/', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                            if(newArtistResponse.status===200 || newArtistResponse.status===201){
                                artistId = newArtistResponse.data.id
                                await RetrieveArtists();
                            } else {
                                setErrorMessage(newArtistResponse.data?.error || "Nieznany błąd");
                                return;
                            }
                        } else {
                            artistId = artist.id
                        }
                        const addArtistResponse = await api.post(`/api/add_event_artist/${currentEvent.id}/`, {
                            artist: artist.id === 0 ? artistId : artist.id
                        });
                        if(addArtistResponse.status!==200 && addArtistResponse.status!==201){
                            setErrorMessage(addArtistResponse.data?.error || "Nieznany błąd");
                            return;
                        }
                        for(const addedArtist of addedArtists){
                            const addedArtistResponse = await api.post('/api/create_notification/', {
                                notificationDescription: `Dodano wydarzenie z udziałem ${addedArtist.name}`, 
                                artist: addedArtist.id,
                                event: currentEvent.id
                            });
                            if(addedArtistResponse.status!==200 && addedArtistResponse.status!==201){
                                setErrorMessage(addedArtistResponse.data?.error || "Nieznany błąd");
                                return;
                            }
                        }
                        for(const deletedArtist of deletedArtists){
                            const deletedArtistResponse = await api.post('/api/create_notification/', {
                                notificationDescription: `${deletedArtist.name} został usunięty z wydarzenia ${currentEvent.name}`, 
                                artist: deletedArtist.id,
                                event: currentEvent.id
                            });
                            if(deletedArtistResponse.status!==200 && deletedArtistResponse.status!==201){
                                setErrorMessage(deletedArtistResponse.data?.error || "Nieznany błąd");
                                return;
                            }
                        }
                    }
                    setCreatedArtistId(0)
                    if(eventPhoto !== null){
                        const newPhotoFormData = new FormData()
                        newPhotoFormData.append("image", eventPhoto)
                        const newMainPhotoResponse = await api.patch(
                        `/api/update_photo/${eventPhotoGallery[0].id}/`,
                            newPhotoFormData,
                            {
                                headers: {
                                'Content-Type': 'multipart/form-data'
                                }
                            }
                        )
                        if(newMainPhotoResponse.status!==200 && newMainPhotoResponse.status !==201){
                                setErrorMessage(newMainPhotoResponse .data?.error || "Nieznany błąd")
                                return                                
                        }
                    }
                    for(const photo of newImages){
                        const photoFormData = new FormData()
                        photoFormData.append("image", photo)
                        photoFormData.append("eventImage", currentEvent.id)
                        const addPhotoResponse = await api.post(`/api/upload_photo/`, photoFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        if(addPhotoResponse .status!==200 && addPhotoResponse.status !==201){
                            setErrorMessage(addPhotoResponse .data?.error || "Nieznany błąd")
                            return                                
                        }
                    }
                    await RetrievePhotos()
                    const companyNotificationResponse = await api.post('/api/create_notification/', {notificationDescription: `Organizacja ${company.name} zaaktualizowała ${currentEvent.name}`, company: company.id, event: currentEvent.id})
                    if(companyNotificationResponse.status!==200 && companyNotificationResponse!==201){
                        setErrorMessage(companyNotificationResponse.data?.error || "Nieznany błąd")
                        return                                
                    }
                    await RetrieveNotifications()
                    const newCompanyTags = company.tags + tags
                    const companyAddTagsResponse = await api.patch(`/api/update_company/`, {tags: newCompanyTags})
                    if(companyAddTagsResponse.status!==200 && companyAddTagsResponse!==201){
                        setErrorMessage(companyAddTagsResponse.data?.error || "Nieznany błąd")
                        return                                
                    }
                    window.location.replace("/#/company_event_list");
                    return;               
                }else{
                    setErrorMessage(eventResponse.data?.error || "Nieznany błąd")
                    return
                }
            }catch(err) {
                setErrorMessage(err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania")
                return
            }finally{
                setLoading(false);
            }
        }
    };
    return(
        <>
        <header>
            <LoggedNavbar/>
        </header>
        <nav>
            <LoggedMenuOffcanvas/>
        </nav>
        <main>
            <section>
                <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={false} 
                    subheadingDisplayed={true}
                    headingText="Stwórz wydarzenie" 
                    subheadingText = " "/>
            </section>
            <Form onSubmit={handleSubmition}>
                <div className="event-page-headlines">
                    <h2>
                        Nazwa wydarzenia:
                    </h2>
                </div>
                <div className="event-create-frame">
                    <InputGroup className="event-create-input-group">
                        <InputGroup.Text  className="event-create-input">
                        Nazwa
                        </InputGroup.Text>
                        <Form.Control
                        autoFocus
                        className="event-create-input-control"
                        aria-label="Nazwa wydarzenia"
                        value={eventName}
                        onChange={handleEventName}
                        />
                    </InputGroup>
                    <div className="text-muted login-form-control-error text-center" style={{display: eventName ? 'none' : 'block'}}>
                        To pole musi być wypełnione
                    </div>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Data wydarzenia:
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center'}}>
                        <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                            <Form.Control
                                className="event-create-input-control"
                                type='datetime-local'
                                bsPrefix="form-control"
                                aria-label="Nazwa wydarzenia"
                                type="date"
                                value={firstDate}
                                onChange={(e) => {
                                    setFirstDate(e.target.value);
                                    setSecondDate(e.target.value)}}
                            />
                        </Form.Group>
                        <div className="text-muted login-form-control-error text-center" style={{display:  firstDate ? 'none' : 'block'}}>
                            To pole musi być wypełnione
                        </div>
                        <div className="text-muted login-form-control-error text-center" style={{display:  notInThePast(firstDate) ? 'none' : 'block'}}>
                            Data nie może być w przeszłości
                        </div>
                        <Form.Group className="mb-3" controlid="formBasicCheckbox" checked={showSecondDate} onChange={handleShowSecondDate}>
                            <Form.Check className="create-event-check" type="checkbox" label="Wielodniowe wydarzenie"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlid="exampleForm.ControlInput1" style={{display: showSecondDate ? 'block' : 'none'}}>
                            <Form.Control
                                className="event-create-input-control"
                                type='datetime-local'
                                autoFocus
                                bsPrefix="form-control"
                                aria-label="Druga data"
                                type="date"
                                value={secondDate}
                                onChange={(e) => {
                                    setSecondDate(e.target.value)}}
                            />
                            <div className="text-muted login-form-control-error text-center" style={{display: compareDates(firstDate, secondDate) ? 'none' : 'block'}}>
                                Druga data nie może być wcześniejsza niż pierwsza
                            </div>
                            <div className="text-muted login-form-control-error text-center" style={{display:  notInThePast(secondDate) ? 'none' : 'block'}}>
                                Data nie może być w przeszłości
                            </div>
                        </Form.Group>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Miejsce wydarzenia:
                    </h2>
                </div>
                <div className="event-create-frame">
                    <InputGroup className="event-create-input-group">
                        <InputGroup.Text className="event-create-input">
                            Nazwa miejsca:
                        </InputGroup.Text>
                        <Form.Control
                        className="event-create-input-control"
                        aria-label="Nazwa miejsca wydarzenia"
                        value={venueName}
                        onChange={handleVenueNameInput}
                        />
                    </InputGroup>
                    <div className="text-muted login-form-control-error text-center" style={{display: venueName ? 'none' : 'block'}}>
                        To pole musi być wypełnione
                    </div>
                    <InputGroup className="event-create-input-group">
                        <InputGroup.Text className="event-create-input">
                        ul.
                        </InputGroup.Text>
                        <Form.Control
                        className="event-create-input-control"
                        aria-label="Ulica wydarzenia"
                        value={street}
                        onChange={handleStreetInput}
                        />
                    </InputGroup>
                    <div className="text-muted login-form-control-error text-center" style={{display: street ? 'none' : 'block'}}>
                        To pole musi być wypełnione
                    </div>
                    <div className="text-muted login-form-control-error text-center" style={{display: streetCorrect ? 'none' : 'block'}}>
                        Nieprawdiłowa ulica (ul. Kościuszki 19)
                    </div>
                    <InputGroup className="event-create-input-group">
                        <InputGroup.Text className="event-create-input">
                        Miejscowość:
                        </InputGroup.Text>
                        <Form.Control
                        className="event-create-input-control"
                        aria-label="Miejscowość wydarzenia"
                        value={townName}
                        onChange={handleTownInput}
                        />
                    </InputGroup>
                    <div className="text-muted login-form-control-error text-center" style={{display: townName ? 'none' : 'block'}}>
                        To pole musi być wypełnione
                    </div>
                    <div className="text-muted login-form-control-error text-center" style={{display: townCorrect ? 'none' : 'block'}}>
                        Nieprawidłowa nazwa miasta 
                    </div>
                    <Dropdown onSelect={selectVoivod}>
                        <Dropdown.Toggle id="dropdown-basic" className="dropdown-toggle modal-dropdown">
                            {voivod}
                        </Dropdown.Toggle>
                        <Dropdown.Menu bsPrefix="dropdown-menu modal-dropdown-content-background">
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="dolnośląskie">dolnośląskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="kujawsko-pomorskie">kujawsko-pomorskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="lubelskie">lubelskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="lubuskie">lubuskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="łódzkie">łódzkie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="małopolskie">małopolskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="mazowieckie">mazowieckie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="opolskie">opolskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="podkarpackie">podkarpackie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="podlaskie">podlaskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="pomorskie">pomorskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="śląskie">śląskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="świętokrzyskie">świętokrzyskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="warmińsko-mazurskie">warmińsko-mazurskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="wielkopolskie">wielkopolskie</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="zachodniopomorskie">zachodniopomorskie</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="text-muted login-form-control-error text-center" style={{display: voivodCorrect ? 'none' : 'block'}}>
                        Wybierz województwo
                    </div>
                    <iframe
                        style={{border: '0', borderRadius: '10px', width: '100%', height: '30vh'}}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_API_GOOGLE}
                        &q=ul.${street},+${townName},+woj.${voivod}`}>
                    </iframe>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Bilety:
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Form.Group className="mb-3" controlid="formBasicCheckbox">
                        <Form.Check className="create-event-check" type="checkbox" label="Czy wstęp jest darmowy?" checked={showTickets} onChange={handleShowTickets}/>
                    </Form.Group>
                    <div style={{width: '100%', display: !showTickets ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <InputGroup className="event-create-input-group">
                            <InputGroup.Text className="event-create-input">
                                Link do wydarzenia:
                            </InputGroup.Text>
                            <Form.Control
                            className="event-create-input-control"
                            aria-label="Link organizacji do strony wydarzenia"
                            value={eventTicketsLink}
                            onChange={handleEventTicketsLinkInput}
                            />
                        </InputGroup>
                        <div className="text-muted login-form-control-error text-center" style={{display: eventTicketsLinkCorrect ? 'none' : 'block'}}>
                            Nieprawidłowy link
                        </div>
                        <InputGroup className="event-create-input-group">
                            <InputGroup.Text className="event-create-input">
                            Najtańsze bilety:
                            </InputGroup.Text>
                            <Form.Control
                            className="event-create-input-control"
                            aria-label="Najtańsze bilety normalne"
                            value={handleNumbers(cheapTicketPrice)}
                            onChange={handleCheapTicketPrice}
                            type="number" placeholder="0" min={0} max = {999999} step={0.5}
                            />
                        </InputGroup>
                        <InputGroup className="event-create-input-group">
                            <InputGroup.Text className="event-create-input">
                            Najdroższe bilety:
                            </InputGroup.Text>
                            <Form.Control
                            className="event-create-input-control"
                            aria-label="Najdroższe bilety normalne"
                            value={handleNumbers(expensiveTicketPrice)}
                            onChange={handleExpensiveTicketPrice}                        
                            type="number" placeholder="0" min={0} max = {999999} step={0.5}
                            />
                        </InputGroup>
                        <div className="text-muted login-form-control-error text-center" style={{display:compare(cheapTicketPrice,expensiveTicketPrice) ? 'none' : 'block'}}>
                            Najniższa cena powinna być mniejsza od najwyższej
                        </div>
                        <Form.Group className="mb-3" controlid="formBasicCheckbox">
                            <Form.Check className="create-event-check" type="checkbox" label="Czy są dostępne bilety ulgowe?" checked={showConcession} onChange={handleShowConcession}/>
                        </Form.Group>
                        <div style={{width: '100%', display: showConcession ? 'flex' : 'none', flexDirection: 'column'}}>
                            <InputGroup className="event-create-input-group">
                                <InputGroup.Text className="event-create-input">
                                Najtańsze bilety ulgowe
                                </InputGroup.Text>
                                <Form.Control
                                className="event-create-input-control"
                                aria-label="Najtańsze bilety ulgowe"
                                value={handleNumbers(cheapConcessionTicketPrice)}
                                onChange={handleConcessionCheapTicketPrice}
                                type="number" placeholder="0" min={0} max = {999999} step={0.5}
                                />
                            </InputGroup>
                            <InputGroup className="event-create-input-group">
                                <InputGroup.Text className="event-create-input">
                                Najdroższe bilety ulgowe
                                </InputGroup.Text>
                                <Form.Control
                                className="event-create-input-control"
                                aria-label="Najdroższe bilety ulgowe"
                                value={handleNumbers(expensiveConcessionTicketPrice)}
                                onChange={handleConcessionExpensiveTicketPrice}                       
                                type="number" placeholder="0" min={0} max = {999999} step={0.5}
                                />
                            </InputGroup>
                            <div className="text-muted login-form-control-error text-center" style={{display:compare(cheapConcessionTicketPrice,expensiveConcessionTicketPrice) ? 'none' : 'block'}}>
                                Najniższa cena powinna być mniejsza od najwyższej
                            </div>
                        </div>
                    </div>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Tagi:
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                        <Dropdown onSelect={handleTypeSelection}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                {eventType}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Muzyczne">Muzyczne</Dropdown.Item>
                                <Dropdown.Item eventKey="Sportowe">Sportowe</Dropdown.Item>
                                <Dropdown.Item eventKey="Spektakle">Spektakle</Dropdown.Item>
                                <Dropdown.Item eventKey="Plenerowe">Plenerowe</Dropdown.Item>
                                <Dropdown.Item eventKey="Muzealne">Muzealne</Dropdown.Item>
                                <Dropdown.Item eventKey="Konwenty">Konwenty</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown onSelect={handleEventGenre}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                {eventGenre}
                            </Dropdown.Toggle>
                            {genreContent}
                        </Dropdown>
                    </div>
                    <Button className="event-page-main-button" onClick={handlePrimaryTagGroup}>
                        Dodaj główne tagi
                    </Button>
                    <InputGroup className="event-create-input-group">
                        <InputGroup.Text className="event-create-input">
                            Dodatkowe tagi
                        </InputGroup.Text>
                        <Form.Control
                        className="event-create-input-control"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        controlid="secondaryForm"
                        onChange={handleSecondaryTag}
                        />
                    </InputGroup>
                    <Button className="event-page-main-button" onClick={handleSecondaryTagGroup}>
                        Dodaj pomniejsze tagi
                    </Button>
                    <div className="event-page-tag-container">
                        {primaryTagGroup.map((tag, index) => (
                            <React.Fragment key={`${tag}-${index}`}>
                                <Badge bg="primary primary-tag">{tag}</Badge>
                                <Button
                                    className="little-delete-button"
                                    onClick={() => deleteFromPrimary(tag)}
                                >
                                    Usuń
                                </Button>
                            </React.Fragment>
                        ))}
                        {secondaryTagGroup.map((tag, index) => (
                            <React.Fragment key={`${tag}-${index}`}>
                                <Badge bg="secondary secondary-tag">{tag}</Badge>
                                <Button
                                    className="little-delete-button"
                                    onClick={() => deleteFromSecondary(tag)}
                                >
                                    Usuń
                                </Button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Artyści
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <a tabIndex="0" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleShowArtistModal;
                                }
                            }}className="event-create-plus-sign" onClick={handleShowArtistModal}><img src="/add.svg" alt="Dodaj artystę"/></a>
                </div>
                <div className="event-page-artist-container-scroll">
                    {artistGroup.map((artist, index) =>(
                        <Card className="artist-card" key={index}>
                            <div className="artist-card-a">
                                <Card.Img className="artist-card-image" variant="top" src={artist.id === 0 || String(artist.photoOfArtist).includes(import.meta.env.VITE_API_URL) ? artist.photoOfArtist : `${import.meta.env.VITE_API_URL}${photos.find(item => item.id === artist.photoOfArtist)?.image}`} alt="zdjęcie artysty"/>
                            </div>
                            <Card.Body className="artist-card-body">
                                <Card.Text className="artist-card-name">
                                    {artist.name}
                                </Card.Text>
                                <Button className="event-card-button" variant="primary" onClick={() => deleteFromArtists(artist.name)}>Usuń</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Opis:
                    </h2>
                </div>
                <div className="event-create-frame">
                    <InputGroup style={{height: '40vh'}}>
                        <Form.Control className="event-create-input-control" as="textarea" aria-label="Słowny opis wydarzenia" value={eventDescription} onChange={handleEventDescritption}/>
                    </InputGroup>
                    <div className="text-muted login-form-control-error text-center" style={{display: eventDescription ? 'none' : 'block'}}>
                        To pole musi być wypełnione
                    </div>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Dodatkowe informacje:
                    </h2>
                </div>
                <div className="event-create-frame">
                    <InputGroup style={{height: '40vh'}}>
                        <Form.Control className="event-create-input-control" as="textarea" aria-label="Dodatkowe informacje" value={eventAdditional} onChange={handleEventAdditional}/>
                    </InputGroup>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Zdjęcie promujące wydarzenie:
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Form.Group controlid="formFile" className="mb-3">
                        <Form.Control className="event-create-input-control" type="file" onChange={handleEventPhoto}/>
                    </Form.Group>
                    <img src={eventPhotoPreview} className="event-create-promotional-photo" style={{border: '2px solid #4C2C72', borderRadius: '10px'}}/>
                </div>
                <div className="event-page-headlines">
                    <h2>
                        Galeria zdjęć:
                    </h2>
                </div>
                <div className="event-create-frame" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Form.Group controlid="formFile" className="mb-3" onChange={handleAddedPhoto}>
                        <Form.Control className="event-create-input-control" type="file" onChange={handleAddedPhoto}/>
                    </Form.Group>
                    <Button className="event-page-main-button" onClick={handleGalleryImages}>
                        Dodaj zdjęcie
                    </Button>
                    <div className="event-photo-gallery">
                        {galleryImagesFiles.map((image) =>(
                            <div className="gallery-image">
                                <img src={image}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="event-page-main-buttons">
                    <Form.Check className="create-event-check" type="checkbox" label="Inni pracownicy mogą edytować to wydarzenie" checked={canEveryoneEdit} onChange={handleCanEveryoneEdit}/>
                    <Button className="event-page-main-button" type="submit">
                        Edytuj wydarzenie
                    </Button>
                    <div style={{margin: '10px', display: loading ? 'flex' : 'none', flexDirection: 'column', alignItems: "center", color: "#4C2C72"}}>
                        <Spinner animation="border" />
                    </div>
                    <Alert key='danger' variant='danger' style={{display: errorMessage ? 'block' : 'none'}}>
                        {errorMessage}
                    </Alert>
                </div>
            </Form>
        </main>
        <ArtistListModal
            showMainModal={showArtistModal}
            mainModalHide={closeArtistModal}
            artistNameValue={newArtistName}
            handleArtistNameInput={handleNewArtistName}
            handleArtistPhoto={handleNewArtistPhoto}
            artistAddErrorMessage={newArtistErrorMessage}
            artistAddFileSource={newArtistPhoto}
            handleArtistAddErrorMessage={handleNewArtistErrorMessage}
            artistCardButtonFunction={artistCardButtonFunction}/>
        <Footer/>
        </>
    );
}

export default EditEventPage;