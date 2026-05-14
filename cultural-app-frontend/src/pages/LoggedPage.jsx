import React from 'react';
import LoggedNavBar from '../components/LoggedNavBar';
import MiniHero from '../components/MiniHero';
import EventSlider from '../components/EventSlider';
import Footer from '../components/Footer';
import { CURRENT_USER, REFRESH_TOKEN } from '../constants';
import { EVENTS } from '../constants';
import { getEventsByTags } from '../globalFuns';
import { useEffect } from 'react';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function LoggedPage(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);  
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const text = `Witaj, ${user.username}!`
    const now = new Date()
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const userEvents = events?.filter(item => user.followedEvents.includes(item.id) && new Date(item.dateSecond) >= now && item.isActive).sort((a, b) => new Date(a.date) - new Date(b.date))
    const allEvents = events.filter(item => new Date(item.dateSecond) >= now && item.isActive && !item.soldOut).sort((a,b) => b.numberOfFollowers - a.numberOfFollowers)
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
                        headingSpecial={true} 
                        subheadingDisplayed={true}
                        headingText={text}
                        subheadingText = " "/>
                </section>
                <section>
                    <EventSlider 
                        sliderHeading="Twoje wydarzenia" 
                        buttonDisplay={false} 
                        eventBrowseLink="/#/event_list"
                        events={userEvents}/>
                </section>
                <section>
                    <EventSlider 
                        sliderHeading="Wydarzenia, które mogą cię zainteresować" 
                        buttonDisplay={true} 
                        eventBrowseLink="/#/event_list"
                        events={getEventsByTags(user.tags)}/>
                </section>
                <section>
                    <EventSlider 
                        sliderHeading="Wszystkie wydarzenia" 
                        buttonDisplay={true} 
                        eventBrowseLink="/#/event_list"
                        events={allEvents}/>
                </section>
            </main>
            <Footer/>   
        </>
    );
}

export default LoggedPage;