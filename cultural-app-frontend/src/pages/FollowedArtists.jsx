import React from 'react';
import NavBar from '../components/NavBar';
import LoggedNavBar from '../components/LoggedNavBar';
import ArtistCard from '../components/ArtistCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ArtistSearchSection from '../components/ArtistSearchSection';
import Pagi from '../components/Pagi'
import MiniHero from '../components/MiniHero';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';
import { CURRENT_USER, ARTISTS, PHOTOS } from '../constants';
import { useState, useEffect } from 'react';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
function FollowedArtists(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const userArtists = artists.filter(item => user.followedArtists.includes(item.id))
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const [artistPages,setArtistPages] = useState(userArtists.map((item, index) => ({artist: item, page: Math.floor(index/30)})))
    const [pagesMax, setPageMax]= useState(Math.max(0,...artistPages?.map(item => item.page)))
    const [currentPage, setCurrentPage] = useState(0)
    const handleCurrentPage = (value) => {
        setCurrentPage(value)
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
                    headingSpecial={true} 
                    subheadingDisplayed={true}
                    headingText="Twoi Artyści" 
                    subheadingText = " "/>
            </section>
            <section>
                <div className="event-page-artist-container">
                    {artistPages.filter(item=> item.page === currentPage).map((content, index) =>(                
                        <ArtistCard
                            artistName={content.artist.name}
                            artistPhoto={`${import.meta.env.VITE_API_URL}${photos.find(item => item.id === content.artist.photoOfArtist)?.image}`}
                            artistPage ={`/#/artist_page/${content.artist.id}`}
                            artistId={content.artist.id}
                            isArtist={true}/>  
                    ))}
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

export default FollowedArtists;