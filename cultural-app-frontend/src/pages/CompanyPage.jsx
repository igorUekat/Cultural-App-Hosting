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
import { ARTISTS, COMPANIES, PHOTOS, EVENTS, CURRENT_USER } from '../constants';
import { isUserLogged } from '../globalFuns';
import { followCompany, unfollowCompany } from '../FollowFuns';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
function CompanyPage(){
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
    const companyId = Number(id)
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const company = companies.find(item => item.id === companyId)
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const companyPhoto = photos.find(item => item.id === company.companyPhoto)
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const companyEvents = events.filter(item => item.company === company.id)
    const now = new Date()
    const companyArtistsIds = companyEvents.flatMap(item => item.artists)
    const companyArtists = artists.filter(item => companyArtistsIds.includes(item.id))
    const handleTags = (t) => {
        if(!t) return
        const splitTags = t.split(";")
        const parsedTags = splitTags.map(item =>{
            const [text, type] = item.split(":")
            return {text, type}
        })
        return parsedTags
    }
    const [tags, setTags] = useState(handleTags(company.tags))
    const currentEvents = companyEvents.filter(item => new Date(item.dateSecond) >= now);
    const pastEvents = companyEvents.filter(item => new Date(item.dateSecond) < now);
    const rawUser = localStorage.getItem(CURRENT_USER)
    const user = rawUser ? JSON.parse(rawUser) : null
    console.log(user)
    const [isFollowed, setIsFollowed] = useState(user?.followedCompanies?.includes(companyId) ?? false)
    const handleFollowing = async () => {
        if(!isFollowed){
            try{
                await followCompany(companyId)
                setIsFollowed(true)  
            }catch(err){
                console.log("Coś poszło nie tak" + err)
            }
        }else{
            await unfollowCompany(companyId)
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
                <Hero heroImage={`${import.meta.env.VITE_API_URL}${companyPhoto.image}`} 
                    headingSpecial={true} 
                    subheadingDisplayed={false}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText={company.name} />
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
                        Tagi
                    </h2>
                </div>
                <div className="event-page-tag-container">
                    {tags?.map((tag, index) => (
                        <React.Fragment key={`${index}`}>
                            <Badge bg={`${tag.type} ${tag.type}-tag`}>{tag.text}</Badge>
                        </React.Fragment>
                    ))}
                </div>
            </section>
            <section>
                <div className="event-page-headlines">
                    <h2>
                        U organizacji występowali:
                    </h2>
                </div>
                <div className="event-page-artist-container-scroll">
                    {companyArtists.map((artist, id) =>
                    (
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
                <EventSlider 
                sliderHeading="Aktualne wydarzenia" 
                buttonDisplay={false} 
                events={currentEvents}
                />
                <EventSlider 
                    sliderHeading="Aktualne wydarzenia" 
                    buttonDisplay={false} 
                    events={pastEvents}
                />
            </section>
        </main>
        <Footer/>  
        </>
    );
}

export default CompanyPage;