import React from 'react';
import LoggedNavBar from '../components/LoggedNavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';
import EventHolder from '../components/EventHolder';
import Pagi from '../components/Pagi';
import MiniHero from '../components/MiniHero';
import ConfirmationModal from '../page_elements/CompanyEventList/ConfirmationModal';
import DateModal from '../page_elements/CompanyEventList/DateModal';
import { useState, useEffect } from 'react';
import { CURRENT_USER, EVENTS, PHOTOS } from '../constants';
import api from '../api';
import { RetrieveEvents } from '../globalFuns';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
import EventCard from '../components/EventCard';
function CompanyEventList(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const now = new Date()
    const companyEvents = events?.filter(item => item.company === user.company_id && new Date(item.dateSecond) > now && item.isActive).sort((a, b) => new Date(a.date) - new Date(b.date))
    const eventPages = companyEvents?.map((item, index) => ({event: item, page: Math.floor(index/5)}))
    const pagesMax = Math.max(0,...eventPages?.map(item => item.page))
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const handleCurrentPage = (value) => {
        setCurrentPage(value)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } 
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a, b) => a.id - b.id)
    const [currentEventId, setCurrentEventId] = useState(0)
    const [currentName, setCurrentName] = useState("")
    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleShowCancelModal = (id, name) => {
        setCurrentEventId(id)
        setCurrentName(name)
        setShowCancelModal(true);
    };
    const closeCancelModal = () => {
        setCurrentEventId(0)
        setCurrentName("")
        setShowCancelModal(false);
    };
    const handleCancelAction = async () => {
        try {
            setLoading(true)
            const payload = {isActive: false}
            const response = await api.patch(`/api/patch_event/${currentEventId}/`, payload);
            if (response.status === 200 || response.status === 201) {
                const notificationResponse = await api.post('/api/create_notification/', {
                    notificationDescription: `Wydarzenie ${currentName} zostało odwołane!`, 
                    event: currentEventId
                });
                if (notificationResponse.status === 200 || notificationResponse.status === 201){
                    closeCancelModal();
                    location.reload();
                }
            }
        } catch (err) {
            console.log(err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania");
        }finally{
            setLoading(false)            
        }
    }
    const [showSoldOutModal, setShowSoldOutModal] = useState(false);
    const handleShowSoldOutModal = (id, name) => {
        setCurrentEventId(id)
        setCurrentName(name)
        setShowSoldOutModal(true);
    };
    const closeSoldOutModal = () => {
        setCurrentEventId(0)
        setCurrentName("")
        setShowSoldOutModal(false);
    };
    const handleSoldOutAction = async () => {
        try {
            setLoading(true)
            const payload = {soldOut: true}
            const response = await api.patch(`/api/patch_event/${currentEventId}/`, payload);
            if (response.status === 200 || response.status === 201) {
                const notificationResponse = await api.post('/api/create_notification/', {
                    notificationDescription: `Wydarzenie ${currentName} zostało wyprzedane!`, 
                    event: currentEventId
                });
                if(notificationResponse.status === 200 || notificationResponse.status === 201){
                    setCurrentEventId(0)
                    closeSoldOutModal();
                    location.reload();
                }
            }
        } catch (err) {
            console.log(err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania");
        }finally{
            setLoading(false)
        }
    }
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleShowDeleteModal = (id, name) => {
        setCurrentEventId(id)
        setCurrentName(name)
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setCurrentEventId(0)
        setCurrentName("")
        setShowDeleteModal(false);
    };
    const handleDeleteAction = async () => {
        try {
            setLoading(true)
            const response = await api.delete(`/api/delete_event/${currentEventId}/`);
            if (response.status === 200 || response.status === 201) {
                setCurrentEventId(0)
                closeDeleteModal();
                location.reload();
            }
        } catch (err) {
            console.log(err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania");
        }finally{
            setLoading(false)
        }
    }
    const [showDateModal, setShowDateModal] = useState(false);
    const handleShowDateModal = (id, name) => {
        setCurrentEventId(id)
        setCurrentName(name)
        setShowDateModal(true);
    };
    const closeDateModal = () => {
        setCurrentEventId(0)
        setCurrentName("")
        setShowDateModal(false);
    };
    const [newDate, setNewDate] = useState("");
    const [newDateRange, setNewDateRange] = useState("");
    const handleNewDate = (e) => {
        setNewDate(e.target.value);
        setNewDateRange(e.target.value);
    };
    const handleNewDateRange = (e) => {
        setNewDateRange(e.target.value);
    };
    const [dateErrorMessage, setDateErrorMessage] = useState("");
    const handleErrorMessage = async() => {
        if(new Date(newDate) > new Date(newDateRange)){
            setDateErrorMessage("Data końca wydarzenia nie może być wcześniejsza niż data jego początku")
        }else if(new Date(newDate) < now || new Date(newDateRange) < now){
            setDateErrorMessage("Żadna data nie może być w przeszłości")           
        }else if(!newDate){
            setDateErrorMessage("Należy wypełnić co najmniej pierwsze pole, aby zmienić datę wydarzenia")
        }else{
            try {
                setLoading(true)
                const payload = {date: new Date(newDate).toISOString(), dateSecond: new Date(newDateRange).toISOString()}
                const response = await api.patch(`/api/patch_event/${currentEventId}/`, payload);
                if (response.status === 200 || response.status === 201) {
                    const notificationResponse = await api.post('/api/create_notification/', {
                        notificationDescription: `Wydarzenie ${currentName} zostało przesunięte!`, 
                        event: currentEventId
                    });
                    if(notificationResponse.status === 200 || notificationResponse.status === 201){
                        setCurrentEventId(0)
                        closeDateModal()
                        location.reload();
                    }
                }
            } catch (err) {
                console.log(err.response?.data?.error || err.message || "Wystąpił błąd podczas edytowania");
            }finally{
                setLoading(false)
            }           
        }
    };

    return(
        <>
        <header>
            <LoggedNavBar />
        </header>
        <nav>
            <LoggedMenuOffcanvas/>
        </nav>
        <main>
            <section>
                <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={true} 
                    subheadingDisplayed={true}
                    headingText="Wasze wydarzenia" 
                    subheadingText = "Wasze aktualne wydarzenia"/>
            </section>
            <section>
                <div className="event-list-container">         
                    {eventPages.filter(item => item.page === currentPage).map((content, index) =>{
                        let eventHolder;
                        if(innerWidth >= 1000){
                            eventHolder = (
                            <>
                                <EventHolder
                                    as="article"
                                    eventImage={`${import.meta.env.VITE_API_URL}${photos?.find(item => item.eventImage === content.event.id).image}`}
                                    eventName={content.event.name}
                                    eventPlace={`${content.event.placeName}, ${content.event.placeTown}, woj.${content.event.placeVoivod}`}
                                    eventPrice={Number(content.event.lowestPriceNorm) === Number(content.event.highestPriceNorm) ? (Number(content.event.lowestPriceNorm) === 0.00 ? "Wstęp darmowy" : `${content.event.lowestPriceNorm} zł`) : `od ${content.event.lowestPriceNorm }zł do ${content.event.highestPriceNorm} zł` }
                                    eventDescription={content.event.description}
                                    eventPopularity={content.event.numberOfFollowers}
                                    eventLink={`/#/event_page/${content.event.id}/`}
                                    eventDate={content.event.date === content.event.dateSecond ? `${content.event.date.split("T")[0]}` : `od ${content.event.date.split("T")[0]} do ${content.event.dateSecond.split("T")[0]}`}
                                    eventId={content.event.id}
                                    eventTags={content.event.tags}
                                    numberOfFollowers={content.event.numberOfFollowers}
                                    />
                                <div className='edit-event-container'>
                                    {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" style={{textDecoration: 'none', color: "#9be37d"}}href={`/#/edit_event/${content.event.id}/`}>Edytuj</a>}
                                    {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" 
                                                                                                                                onKeyDown={(e) => {
                                                                                                                                                    if (e.key === 'Enter') {
                                                                                                                                                        handleShowCancelModal(content.event.id, content.event.name);
                                                                                                                                                    }
                                                                                                                                                }}onClick={() => handleShowCancelModal(content.event.id, content.event.name)}>Odwołaj</a>}
                                    {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                                    if (e.key === 'Enter') {
                                                                                                                                                        handleShowDateModal(content.event.id, content.event.name);
                                                                                                                                                    }
                                                                                                                                                }} onClick={() => handleShowDateModal(content.event.id, content.event.name)}>Przesuń</a>}
                                    {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                                    if (e.key === 'Enter') {
                                                                                                                                                        handleShowSoldOutModal(content.event.id, content.event.name);
                                                                                                                                                    }
                                                                                                                                                }}onClick={() => handleShowSoldOutModal(content.event.id, content.event.name)}>Ogłoś jako "wyprzedane"</a>}
                                    {(user.id === content.event.createdBy || content.event.everyoneCanEdit || user.companyRole === "Owner" || user.companyRole === "Admin") &&<a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                                    if (e.key === 'Enter') {
                                                                                                                                                        handleShowDeleteModal(content.event.id);
                                                                                                                                                    }
                                                                                                                                                }} onClick={() => handleShowDeleteModal(content.event.id)}>Usuń</a>}
                                </div>
                            </>
                            )
                        }else{
                            eventHolder = (
                            <>
                            <EventCard 
                                key={content.event.id}
                                eventImage={`${import.meta.env.VITE_API_URL}${photos?.find(p => p.eventImage === content.event.id).image}`}
                                eventTitle={content.event.name} 
                                eventDate={content.event.date === content.event.dateSecond ? `${content.event.date.split("T")[0]}` : `od ${content.event.date.split("T")[0]} do ${content.event.dateSecond.split("T")[0]}`}
                                eventPlace={`${content.event.placeTown}, woj.${content.event.placeVoivod}`} 
                                eventPrice={Number(content.event.lowestPriceNorm) === Number(content.event.highestPriceNorm) ? (Number(content.event.lowestPriceNorm) === 0.00 ? "Wstęp darmowy" : `${content.event.lowestPriceNorm} zł`) : `od ${content.event.lowestPriceNorm }zł do ${content.event.highestPriceNorm} zł` }
                                eventLink={`/#/event_page/${content.event.id}/`}
                                eventId={content.event.id}
                                eventTags={content.event.tags}
                                numberOfFollowers={content.event.numberOfFollowers}
                            />
                            <div className='edit-event-container'>
                            {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" style={{textDecoration: 'none', color: "#9be37d"}}href={`/#/edit_event/${content.event.id}/`}>Edytuj</a>}
                            {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" 
                                                                                                                        onKeyDown={(e) => {
                                                                                                                                            if (e.key === 'Enter') {
                                                                                                                                                handleShowCancelModal(content.event.id, content.event.name);
                                                                                                                                            }
                                                                                                                                        }}onClick={() => handleShowCancelModal(content.event.id, content.event.name)}>Odwołaj</a>}
                            {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                            if (e.key === 'Enter') {
                                                                                                                                                handleShowDateModal(content.event.id, content.event.name);
                                                                                                                                            }
                                                                                                                                        }} onClick={() => handleShowDateModal(content.event.id, content.event.name)}>Przesuń</a>}
                            {(user.id === content.event.createdBy || content.event.everyoneCanEdit) && <a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                            if (e.key === 'Enter') {
                                                                                                                                                handleShowSoldOutModal(content.event.id, content.event.name);
                                                                                                                                            }
                                                                                                                                        }}onClick={() => handleShowSoldOutModal(content.event.id, content.event.name)}>Ogłoś jako "wyprzedane"</a>}
                            {(user.id === content.event.createdBy || content.event.everyoneCanEdit || user.companyRole === "Owner" || user.companyRole === "Admin") &&<a tabIndex="0" onKeyDown={(e) => {
                                                                                                                                            if (e.key === 'Enter') {
                                                                                                                                                handleShowDeleteModal(content.event.id);
                                                                                                                                            }
                                                                                                                                        }} onClick={() => handleShowDeleteModal(content.event.id)}>Usuń</a>}
                            </div>
                            </>)
                        }
                        return eventHolder
                    }
                    )}      
                </div>
            </section>
            <Pagi
                as="nav" 
                currentPage={currentPage}
                maxValue={pagesMax}
                changePage={handleCurrentPage}/>
        </main>
        <ConfirmationModal 
            modalShow={showCancelModal}
            handleClose={closeCancelModal}
            notificationText="Odwoływanie wydarzenia"
            info="Czy na pewno chcesz odwołać wydarzenie? Procedura jest nieodwracalna"
            handleAction={handleCancelAction}
            loading={loading}/>
        <ConfirmationModal 
            modalShow={showSoldOutModal}
            handleClose={closeSoldOutModal}
            notificationText="Wyprzedane wydarzenie"
            info="Czy na pewno chcesz zadeklarować, że wydarzenie jest wyprzedane? Procedura jest nieodwracalna"
            handleAction={handleSoldOutAction}
            loading={loading}/>
        <ConfirmationModal 
            modalShow={showDeleteModal}
            handleClose={closeDeleteModal}
            notificationText="Usuwanie"
            info="Czy na pewno chcesz usunąć wydarzenie? Procedura jest nieodwracalna"
            handleAction={handleDeleteAction}
            loading={loading}/>
        <DateModal
            modalShow={showDateModal}
            handleClose={closeDateModal}
            inputValue={newDate}
            handleUserInput = {handleNewDate}
            errorMessage = {dateErrorMessage}
            handleErrorMessage={handleErrorMessage}
            inputManyDays={newDateRange}
            handleUserInputManyDays={handleNewDateRange}
            loading={loading}/>
        <Footer/>
        </>
    );
}
export default CompanyEventList;