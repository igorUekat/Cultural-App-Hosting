import React from 'react';
import NavBar from '../components/NavBar';
import LoggedNavBar from '../components/LoggedNavBar';
import Hero from '../components/Hero';
import EventSlider from '../components/EventSlider';
import Footer from '../components/Footer';
import {Button, Container, Row, Col, Card, Badge} from 'react-bootstrap';
import ArtistCard from '../components/ArtistCard';
import MenuOffcanvas from '../components/MenuOffcanvas';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ARTISTS, COMPANIES, PHOTOS, EVENTS } from '../constants';
import { isUserLogged } from '../globalFuns';
import { followArtist, unfollowArtist } from '../FollowFuns';
import { CURRENT_USER } from '../constants';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
function ArtistPage(){
    const [userLogged, setUserLogged] = useState(false);
    useEffect(() => {
        const check = async () => {
            const result = await isUserLogged();
            setUserLogged(result);
        };
        window.scrollTo({ top: 0, left: 0, behavior: 'instant'});
        check();
    }, []);
    const navBar = (truth) =>{
        if(truth){
            return <LoggedNavBar />
        }else{
            return <NavBar/>
        }
    }
    const {id} = useParams()
    const artistId = Number(id)
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const artist = artists.find(item => item.id === artistId)
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const artistPhoto = photos.find(item => item.id === artist.photoOfArtist)
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const artistEvents = events.filter(item => item.artists.includes(artistId))
    console.log(artistEvents)
    const now = new Date()
    const eventPlaces = [
        ...new Map(artistEvents.map(item => companies.find(c => c.id === item.company)).filter(Boolean).map(c => [c.id, c])).values()
    ];
    const currentEvents = artistEvents.filter(item => new Date(item.dateSecond) >= now);
    const pastEvents = artistEvents.filter(item => new Date(item.dateSecond) < now);
    const rawUser = localStorage.getItem(CURRENT_USER)
    const user = rawUser ? JSON.parse(rawUser) : null
    const [isFollowed, setIsFollowed] = useState(user?.followedArtists?.includes(artistId) ?? false)
    const handleFollowing = async () => {
        if(!isFollowed){
            try{
                await followArtist(artistId)
                setIsFollowed(true)  
            }catch(err){
                console.log("Coś poszło nie tak" + err)
            }
        }else{
            await unfollowArtist(artistId)
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
                <Hero heroImage={`${import.meta.env.VITE_API_URL}${artistPhoto.image}`} 
                    headingSpecial={true} 
                    subheadingDisplayed={false}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText={`${artist.name}`} 
                    buttonText = ""/>
            </section>
            <section>
                <div className="event-page-main-buttons">
                    <Button className={isFollowed ? 'event-page-main-button-clicked' : 'event-page-main-button'} onClick={handleFollowing}>
                        {isFollowed ? 'Obserwujesz' : 'Obserwuj'}
                    </Button>
                </div>
            </section>
            <section>
                <div className="event-page-headlines">
                <h2>
                    Organizatorzy wydarzeń, u których uczestniczył artysta:
                </h2>
                </div>
                <div className="event-page-artist-container-scroll">
                    {eventPlaces.map((company, id) =>
                        (
                        <ArtistCard
                            artistName={company.name}
                            artistPhoto={`${import.meta.env.VITE_API_URL}${photos.find(item => item.id === company.companyPhoto)?.image}`}
                            artistPage ={`/#/company_page/${company.id}`}
                            isArtist={false}
                            artistId={company.id}/> 
                    ))}
                </div>
            </section>
            <section>
                <EventSlider 
                    sliderHeading="Aktualne wydarzenia" 
                    buttonDisplay={false} 
                    events={currentEvents}
                />
            </section>
            <section>
                <EventSlider 
                    sliderHeading="Historia wydarzeń" 
                    buttonDisplay={false} 
                    events={pastEvents}
                />
            </section>
        </main>
        <Footer/>  
        </>
    );
}

export default ArtistPage;