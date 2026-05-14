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

function UserHistoryEventList(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const now = new Date()
    const userEvents = events?.filter(item => user.followedEvents.includes(item.id) && (new Date(item.dateSecond) < now || !item.isActive)).sort((a, b) => new Date(a.date) - new Date(b.date))
    const eventPages = userEvents?.map((item, index) => ({event: item, page: Math.floor(index/5)}))
    const pagesMax = Math.max(0,...eventPages?.map(item => item.page))
    const [currentPage, setCurrentPage] = useState(0)
    const handleCurrentPage = (value) => {
        setCurrentPage(value)
    } 
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a, b) => a.id - b.id)
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
                    headingText="Twoje wydarzenia" 
                    subheadingText = "Wydarzenia, które śledzisz" />
            </section>
            <section>
                <div className="event-list-container">
                    {eventPages.filter(item => item.page === currentPage).map((content, index) =>{
                        let eventHolder;
                        if(innerWidth >= 1000){
                            eventHolder = (
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
                            )
                        }else{
                            eventHolder = (
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
                            />)
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
        <Footer/>
        </>
    );
}
export default UserHistoryEventList;