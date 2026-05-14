import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';
import EventHolder from '../components/EventHolder';
import Pagi from '../components/Pagi';
import MiniHero from '../components/MiniHero';
import LoggedNavBar from '../components/LoggedNavBar'
import NotificationHolder from '../components/NotificationHolder';
import { useLocation } from "react-router-dom";
import { EVENTS, COMPANIES, ARTISTS, PHOTOS, CURRENT_USER } from '../constants';
import { useEffect } from 'react';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
import api from '../api';
import EventCard from '../components/EventCard';
function NotificationPage(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        const action = async ()=>{
            const user = JSON.parse(localStorage.getItem(CURRENT_USER))
            const now = new Date()
            const payload = {lastTimeNotifOpened: now.toISOString()}
            const response = await api.patch(`/api/update_user/`, payload)
            if(response.status === 200 || response.status === 201){
                user.lastTimeNotifOpened = now.toISOString()
                localStorage.setItem(CURRENT_USER, JSON.stringify(user))
            }
        }
        action()
    }, []);
    const location = useLocation();
    const notifications = location.state?.notifications || [];
    console.log(notifications)
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a,b) => a.id - b.id)
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const innerWidth = window.innerWidth
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
                        headingSpecial={false} 
                        subheadingDisplayed={true}
                        headingText="Powiadomienia" 
                        subheadingText = " " />
            </section>
            <section>
                <div className="event-list-container">
                    {notifications.map(content =>{
                        console.log("doing smth")
                        let photo;
                        if(content.artist){
                            photo = `${import.meta.env.VITE_API_URL}${photos?.find(item => item.artistImage === content.artist)?.image}`
                        }else if(content.company){
                            const company = companies?.find(item => item.id === content.company)
                            photo = `${import.meta.env.VITE_API_URL}${photos?.find(item => item.id === company.companyPhoto)?.image}`                   
                        }else{
                            photo = `${import.meta.env.VITE_API_URL}${photos?.find(item => item.eventImage === content.event)?.image}` 
                        }
                        const event = events?.find(item => item.id === content.event)
                        if (!event) return null;
                        let notificationHolder;
                        if (innerWidth >= 1000){
                            notificationHolder = (<NotificationHolder
                                    key={content.id}
                                    eventImage={photo}
                                    eventName={content.notificationDescription}
                                    eventDate={event.date === event.dateSecond ? `${event.date.split("T")[0]}` : `od ${event.date.split("T")[0]} do ${event.dateSecond.split("T")[0]}`}
                                    eventPlace={`${event.placeName}, ${event.placeTown}, woj.${event.placeVoivod}`}
                                    eventPrice={Number(event.lowestPriceNorm) === Number(event.highestPriceNorm) ? (Number(event.lowestPriceNorm) === 0.00 ? "Wstęp darmowy" : `${event.lowestPriceNorm} zł`) : `od ${event.lowestPriceNorm }zł do ${event.highestPriceNorm} zł` }
                                    eventPopularity={event.numberOfFollowers}
                                    eventLink={`/#/event_page/${event.id}/`}/>)
                        }else{
                            notificationHolder = (<EventCard 
                                    eventImage={photo}
                                    eventTitle={content.notificationDescription} 
                                    eventDate={event.date === event.dateSecond ? `${event.date.split("T")[0]}` : `od ${event.date.split("T")[0]} do ${event.dateSecond.split("T")[0]}`}
                                    eventPlace={`${event.placeName}, ${event.placeTown}, woj.${event.placeVoivod}`}
                                    eventPrice={Number(event.lowestPriceNorm) === Number(event.highestPriceNorm) ? (Number(event.lowestPriceNorm) === 0.00 ? "Wstęp darmowy" : `${event.lowestPriceNorm} zł`) : `od ${event.lowestPriceNorm }zł do ${event.highestPriceNorm} zł` }
                                    eventLink={`/#/event_page/${event.id}/`}
                                    eventId={event.id}
                                    eventTags={event.tags}
                                    numberOfFollowers={event.numberOfFollowers}
                                    />)
                        }
                        return notificationHolder;
                    })}        
                </div>
            </section>
        </main>
        <Footer/>
        </>
    );
}

export default NotificationPage;

{/*<NotificationHolder
        eventImage="https://images.pexels.com/photos/13963614/pexels-photo-13963614.jpeg"
        eventName="Florence and the machine zagra w Polsce!"
        eventDate="01.01.2026-31-12.2026"
        eventPlace="Ergo Arena, Gdańsk, woj.pomorskie"
        eventPrice="od 100zł do 5000zł"
        eventPopularity="312312"
        eventLink="/#/event_page"/> */}