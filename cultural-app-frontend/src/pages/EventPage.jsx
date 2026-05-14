import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import EventSlider from '../components/EventSlider';
import Footer from '../components/Footer';
import EventTextArea from '../components/EventTextArea';
import LoggedNavBar from '../components/LoggedNavBar';
import MenuOffcanvas from '../components/MenuOffcanvas';
import {Button, Container, Row, Col, Card, Badge} from 'react-bootstrap';
import ArtistCard from '../components/ArtistCard';
import { EVENTS, COMPANIES, PHOTOS, ARTISTS, CURRENT_USER } from '../constants';
import { RetrieveEventArtists } from '../globalFuns';
import { isUserLogged } from '../globalFuns';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { followEvent, unfollowEvent } from '../FollowFuns';
import { getEventsByTags } from '../globalFuns';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas'

function EventPage(props){
    const [userLogged, setUserLogged] = useState(false);
    useEffect(() => {
        const check = async () => {
            const result = await isUserLogged();
            setUserLogged(result)
        };
        window.scrollTo({ top: 0, left: 0, behavior: 'instant'});
        setEventArtists(artists.filter(item => eventArtistsIds.includes(item.id)))
        check();
    }, []);
    const innerWidth = window.innerWidth
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const { id } = useParams();
    const eventId= Number(id)
    const event =  events?.find(item => item.id === eventId);
    const [eventArtistsIds, setEventArtistsIds] = useState(event.artists);
    const [eventArtists, setEventArtists] = useState([])
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const company = companies?.find(item => item.id === event.company)
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a,b) => a.id - b.id)
    const eventPhotos = photos?.filter(item => item.eventImage === eventId)
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const navBar = (truth) =>{
        if(truth){
            return <LoggedNavBar />
        }else{
            return <NavBar/>
        }
    }
    const textContent = (
            <p>
                {event.description}
            </p>       
    );
    const textContentAdd = (
            <p>
                {event.additionalInfo}
            </p>       
    );
    const mapContent = (
        <iframe
            className="event-page-map"
            style={{border: '0', borderRadius: '3px'}}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_API_GOOGLE}
            &q=ul.${event.placeStreet},+${event.placeTown},+woj.${event.placeVoivod}`}>
        </iframe>
    );
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
    const handleTags = (t) => {
        if(!t) return
        const splitTags = t.split(";")
        const parsedTags = splitTags.map(item =>{
            const [text, type] = item.split(":")
            return {text, type}
        })
        return parsedTags
    }
    const [tags, setTags] = useState(handleTags(event.tags))
    const companyEvents = events.filter(item => item.company === company.id && item !== event)
    const artistEvents = events.filter(item => item.artists.some(artist => eventArtists.includes(artist)) && item !== event)
    const rawUser = localStorage.getItem(CURRENT_USER)
    const user = rawUser ? JSON.parse(rawUser) : null
    const [isFollowed, setIsFollowed] = useState(user?.followedEvents?.includes(eventId) ?? false)
    const [eventFollowers, setEventFollowers] = useState(event.numberOfFollowers)
    const handleFollowing = async () => {
        if(!isFollowed){
            try{
                await followEvent(eventId, eventFollowers, event.tags)
                setEventFollowers(eventFollowers+1)
                setIsFollowed(true)  
            }catch(err){
                console.log("Coś poszło nie tak" + err)                 
            }
        }else{
            await unfollowEvent(event.id, eventFollowers, event.tags)
            setEventFollowers(eventFollowers-1)
            setIsFollowed(false) 
        }
    }
    const offcanvas = (truth)=>{
        if(truth){
            return <LoggedMenuOffcanvas/>
        }else{
            return <MenuOffcanvas/>
        }
    }
    return(
        <>
        <header>
            {navBar(userLogged)}
        </header>
        <nav>
            {offcanvas(userLogged)}
        </nav>
        <main>
            <section>
                <Hero heroImage={`${import.meta.env.VITE_API_URL}${eventPhotos[0].image}`} 
                    headingSpecial={true} 
                    subheadingDisplayed={true}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText={event.name} 
                    subheadingText = {company.name} 
                    buttonText = ""/>
            </section>
            <section>
                <div className="event-page-main-buttons">
                    <Button className={isFollowed ? 'event-page-main-button-clicked' : 'event-page-main-button'} onClick={handleFollowing}>
                        {isFollowed ? 'Śledzisz' : 'Śledź'}
                    </Button>
                    <Button href={event.link} target="_blank" rel="noopener" className="event-page-main-button">
                        Szczegóły
                    </Button>
                </div>
            </section>
            <section>
                <div style={{display: 'flex', flexWrap:"wrap", justifyContent:"center"}}>
                    <Card className="event-info-container" style={{ width: '65rem', height: '35rem'}}>
                        <Row style={{height: '100%'}}>
                            {innerWidth >= 1000 && <Col style={{height: '100%'}}>
                                <Card.Img 
                                    src={`${import.meta.env.VITE_API_URL}${eventPhotos[0].image}`} 
                                    className="img-fluid rounded-start event-holder-image"
                                    alt="Zdjęcie promujące wydarzenie"
                                />
                            </Col>}
                            <Col md={4} style={{height: '100%'}}>
                                <Card.Body className="event-page-info-block">
                                    <Card.Title className="event-info-title">Szczegóły: </Card.Title>
                                    <div className="event-info-line">
                                        <img src="/calendar-purple.svg" alt="data wydarzenia" height="50rem"/>
                                        <Card.Text className="event-info-text">
                                            {event.date === event.dateSecond ? `${event.date.split("T")[0]}` : `od ${event.date.split("T")[0]} do ${event.dateSecond.split("T")[0]}`}
                                        </Card.Text>
                                    </div>
                                    <div className="event-info-line">
                                        <img src="/location-purple.svg" alt="miejsce wydarzenia" height="50rem"/>
                                        <Card.Text className="event-info-text">
                                            {`${event.placeStreet}, ${event.placeTown}, woj.${event.placeVoivod}`}
                                        </Card.Text>
                                    </div>
                                    <div className="event-info-line">
                                        <img src="/price-purple.svg" alt="cena wstępu" height="50rem"/>    
                                        <Card.Text className="event-info-text">
                                            {price(event.lowestPriceNorm, event.highestPriceNorm)}
                                            <br/>
                                            {event.isCon && <div style={{display: event.isCon ? 'none' : 'block'}}>
                                                {price(event.lowestPriceCon, event.highestPriceCon)}
                                            </div>}  
                                        </Card.Text>
                                    </div>
                                    <div className="event-info-line">
                                        <img src="/heart-purple.svg" alt="liczba śledzących" height="50rem"/>
                                        <Card.Text className="event-info-text">
                                            {eventFollowers}
                                        </Card.Text>                            
                                    </div>                       
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        Tagi
                    </h2>
                </div>
                <div className="event-page-tag-container">
                    {tags.map((tag, index) => (
                        <React.Fragment key={`${index}`}>
                            <Badge bg={`${tag.type} ${tag.type}-tag`}>{tag.text}</Badge>
                        </React.Fragment>
                    ))}
                </div>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        Opis
                    </h2>
                </div>
                <EventTextArea isDark={true} content={textContent}/>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        Artyści
                    </h2>
                </div>
                <div className="event-page-artist-container-scroll">
                    {eventArtists.map((artist, index) =>(
                        <ArtistCard
                            artistName={artist.name}
                            artistPhoto={`${import.meta.env.VITE_API_URL}${photos.find(item => item.id === artist.photoOfArtist)?.image}`}
                            artistPage ={`/#/artist_page/${artist.id}`}
                            artistId={artist.id}
                            isArtist={true}/> 
                    ))}
                </div>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        Mapa
                    </h2>
                </div>
                <EventTextArea isDark={true} content={mapContent}/>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        Dodatkowe informacje
                    </h2>
                </div>
                <EventTextArea isDark={false} content={textContentAdd}/>
            </section>
            <div className="event-page-headlines">
                <h2>
                    Galeria zdjęć
                </h2>
            </div>
            <div className="event-photo-gallery">
                {eventPhotos.map((image) =>(
                    <div className="gallery-image">
                        <img src={`${import.meta.env.VITE_API_URL}${image.image}`}/>
                    </div>
                ))}
            </div>
            <EventSlider 
                sliderHeading="Inne wydarzenia organizatora" 
                buttonDisplay={false}
                events={companyEvents}/>
            <EventSlider 
                sliderHeading="Inne wydarzenia artystów" 
                buttonDisplay={false} 
                events={artistEvents}/>
            <EventSlider 
                sliderHeading="Podobne wydarzenia" 
                buttonDisplay={false} 
                events={getEventsByTags(event.tags, eventId)}/>
        </main>
        <Footer/>  
        </>
    );
}

export default EventPage;