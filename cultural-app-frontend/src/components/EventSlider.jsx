import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import EventCard from './EventCard';
import { useState, useEffect } from 'react';
import { PHOTOS } from '../constants';

function EventSlider(props){
    if(props.events === null || props.events.length === 0){
        return <></>
    }
    const buttonDisplay = props.buttonDisplay ? '' : 'd-none';
    const innerWidth = window.innerWidth
    console.log("current width " + innerWidth)
    let pageLength;
    if(innerWidth<600){
        pageLength = 1
    }else if(innerWidth >= 600 && innerWidth <= 1000){
        pageLength = 2
    }else{
        pageLength = 3
    }
    const [sliderLength, setSliderLength] = useState(props.events.length % pageLength === 0 ? props.events.length/pageLength : Math.floor(props.events.length / pageLength) + 1)
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a, b) => a.id - b.id)
    function makeSliders(){
        let everySlide = []
        let startingId = 0
        for(let i = 1; i<=sliderLength; i++){
            let singleSlide = []
            singleSlide = [...singleSlide, props.events[startingId]]
            if(pageLength > 1 && startingId + 1 < props.events.length){
                singleSlide = [...singleSlide, props.events[startingId+1]]
            }
            if(pageLength > 2 && startingId + 2 < props.events.length){
                singleSlide = [...singleSlide, props.events[startingId+2]]              
            }
            everySlide = [...everySlide, singleSlide]
            startingId += pageLength;
        }
        return everySlide
    }
    const date = (firstDate, secondDate) =>{
        if(new Date(firstDate) === new Date(secondDate)){
            return firstDate
        }else{
            return `od ${firstDate.split("T")[0]} do ${secondDate.split("T")[0]}`
        }
    }
    const price = (lowPrice, highPrice) =>{
        if(Number(lowPrice) === 0 && Number(highPrice) === 0){
            return "Wstęp darmowy"
        }else if(Number(lowPrice) === Number(highPrice)){
            return `${lowPrice} zł`
        }else{
            return `od ${lowPrice}zł do ${highPrice}zł`
        }
    }
    const [sliders, setSliders] = useState(() => makeSliders())
    return(
        <>
        <h1 className="slider-heading">{props.sliderHeading}</h1>
        <Carousel style={{height: '75vh'}} variant='dark'>
            {sliders.map((item, index) => {
            return (
                <Carousel.Item key={index}>
                    <div className="d-flex justify-content-center">
                        {item.map((event) => {
                            return (
                            <EventCard 
                                key={event.id}
                                eventImage={`${import.meta.env.VITE_API_URL}${photos?.find(p => p.eventImage === event.id).image}`}
                                eventTitle={event.name} 
                                eventDate={event.date === event.dateSecond ? `${event.date.split("T")[0]}` : `od ${event.date.split("T")[0]} do ${event.dateSecond.split("T")[0]}`}
                                eventPlace={`${event.placeTown}, woj.${event.placeVoivod}`} 
                                eventPrice={price(event.lowestPriceNorm, event.highestPriceNorm)} 
                                eventLink={`/#/event_page/${event.id}/`}
                                eventId={event.id}
                                eventTags={event.tags}
                                numberOfFollowers={event.numberOfFollowers}
                            />
                            );
                        })}
                    </div>
                </Carousel.Item>
            );
            })}
        </Carousel>
        <div className={buttonDisplay} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button href={props.eventsBrowseLink} className="slider-button">Sprawdzaj dalej</Button>
        </div>
        </>
    );
}

export default EventSlider;