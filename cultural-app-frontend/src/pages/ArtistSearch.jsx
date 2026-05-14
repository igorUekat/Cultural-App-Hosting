import React from 'react';
import NavBar from '../components/NavBar';
import ArtistCard from '../components/ArtistCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ArtistSearchSection from '../components/ArtistSearchSection';
import Pagi from '../components/Pagi'
import MiniHero from '../components/MiniHero';
import LoggedNavBar from '../components/LoggedNavBar';
import MenuOffcanvas from '../components/MenuOffcanvas';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';
import { PHOTOS, ARTISTS } from '../constants';
import {useState, useEffect} from 'react'
import { isUserLogged } from '../globalFuns';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function ArtistSearch(){
    const [userLogged, setUserLogged] = useState(false);
    useEffect(() => {
        const check = async () => {
            const result = await isUserLogged();
            setUserLogged(result);
        };
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        check();
    }, []);
    const navBar = (truth) =>{
        if(truth){
            return <LoggedNavBar />
        }else{
            return <NavBar/>
        }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant'});
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const [artistPages,setArtistPages] = useState(artists.map((item, index) => ({artist: item, page: Math.floor(index/30)})))
    const [pagesMax, setPageMax]= useState(Math.max(0,...artistPages?.map(item => item.page)))
    const [currentPage, setCurrentPage] = useState(0)
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState(artists)
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
    const searchAction = () => {
        const filtered = search ? artists.filter(item => item.name.toLowerCase().includes(search.toLowerCase())): artists;
        const pages = filtered.map((item, index) => ({artist: item, page: Math.floor(index / 30)}));
        const maxPage = Math.max(0, ...pages.map(item => item.page));
        setSearchResult(filtered);
        setArtistPages(pages);
        setPageMax(maxPage);
        setCurrentPage(0);
    };
    const handleCurrentPage = (value) => {
        setCurrentPage(value)
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
                <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={true} 
                    subheadingDisplayed={true}
                    headingText="Artyści" 
                    subheadingText = "Szukaj artystów"/>
            </section>
            <div className="search-section">
                <form onSubmit={searchAction}>
                    <Form.Control
                        aria-label="Szukaj artystów"
                        type="text"
                        placeholder="Szukaj..."
                        className="form-light-color"
                        onChange={handleSearch}
                    />

                    <Button type="submit" className="hero-button">
                        Szukaj
                    </Button>
                </form>
            </div>
            <section className="event-page-artist-container">
                {artistPages.filter(item=> item.page === currentPage).map((content, index) =>(                
                    <ArtistCard
                        artistName={content.artist.name}
                        artistPhoto={`${import.meta.env.VITE_API_URL}${photos.find(item => item.id === content.artist.photoOfArtist)?.image}`}
                        artistPage ={`/#/artist_page/${content.artist.id}`}
                        artistId={content.artist.id}
                        isArtist={true}/> 
                ))}
            </section>
        </main>
        <Pagi
            as="nav"
            currentPage={currentPage}
            maxValue={pagesMax}
            changePage={handleCurrentPage}/>
        <Footer/>
        </>
    );
}

export default ArtistSearch;