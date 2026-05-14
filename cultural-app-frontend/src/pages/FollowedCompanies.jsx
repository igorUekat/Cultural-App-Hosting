import React from 'react';
import NavBar from '../components/NavBar';
import ArtistCard from '../components/ArtistCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ArtistSearchSection from '../components/ArtistSearchSection';
import Pagi from '../components/Pagi';
import MiniHero from '../components/MiniHero';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';
import { CURRENT_USER, COMPANIES, PHOTOS } from '../constants';
import { useState, useEffect } from 'react';
import LoggedNavBar from '../components/LoggedNavBar';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
function FollowedCompanies(){
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const userCompanies = companies.filter(item => user.followedCompanies.includes(item.id))
    const [companyPages,setCompanyPages] = useState(userCompanies.map((item, index) => ({company: item, page: Math.floor(index/30)})))
    const [pagesMax, setPageMax]= useState(Math.max(0,...companyPages?.map(item => item.page)))
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
                    headingText="Obserwowani organizatorzy" 
                    subheadingText = " " 
                    />
            </section>
            <section>
                <div className="event-page-artist-container">
                    {companyPages.filter(item=> item.page === currentPage).map((content, index) =>(                
                        <ArtistCard
                            artistName={content.company.name}
                            artistPhoto={`${import.meta.env.VITE_API_URL}${photos.find(item => item.id === content.company.companyPhoto)?.image}`}
                            artistPage ={`/#/company_page/${content.company.id}`}
                            isArtist={false}
                            artistId={content.company.id}/> 
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

export default FollowedCompanies;