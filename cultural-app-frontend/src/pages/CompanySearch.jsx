import React from 'react';
import NavBar from '../components/NavBar';
import ArtistCard from '../components/ArtistCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ArtistSearchSection from '../components/ArtistSearchSection';
import Pagi from '../components/Pagi'
import MiniHero from '../components/MiniHero';
import LoggedNavBar from '../components/LoggedNavBar';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';
import { PHOTOS, ARTISTS, COMPANIES } from '../constants';
import {useState, useEffect} from 'react'
import { isUserLogged } from '../globalFuns';
import MenuOffcanvas from '../components/MenuOffcanvas';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function CompanySearch(){
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
    const companies = JSON.parse(localStorage.getItem(COMPANIES))
    const photos = JSON.parse(localStorage.getItem(PHOTOS))
    const [companyPages,setCompanyPages] = useState(companies.map((item, index) => ({company: item, page: Math.floor(index/30)})))
    const [pagesMax, setPageMax]= useState(Math.max(0,...companyPages?.map(item => item.page)))
    const [currentPage, setCurrentPage] = useState(0)
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState(companies)
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
    const [eventType, setEventType] = useState('Rodzaj');
    const [genreContent, setGenreContent] = useState(<></>);
    const [eventGenre, setEventGenre] = useState('Gatunek');
    const handleTypeSelection = (value) => {
        setEventGenre("Gatunek");
        const theType  = value;
        if(theType === 'Muzyczne'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Pop">Pop</Dropdown.Item>
                    <Dropdown.Item eventKey="Rock">Rock</Dropdown.Item>
                    <Dropdown.Item eventKey="Metal">Metal</Dropdown.Item>
                    <Dropdown.Item eventKey="Muzyka elektroniczna">Muzyka elektroniczna</Dropdown.Item>
                    <Dropdown.Item eventKey="Filharmonia">Filharmonia</Dropdown.Item>
                    <Dropdown.Item eventKey="Country">Country</Dropdown.Item>
                    <Dropdown.Item eventKey="Blues">Blues</Dropdown.Item>
                    <Dropdown.Item eventKey="Disco">Disco</Dropdown.Item>
                    <Dropdown.Item eventKey="Rap">Rap</Dropdown.Item>
                    <Dropdown.Item eventKey="Jazz">Jazz</Dropdown.Item>
                    <Dropdown.Item eventKey="Alternatywa">Alternatywa</Dropdown.Item>
                </Dropdown.Menu>    
            );
        }else if(theType === 'Sportowe'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Piłka nożna">Piłka nożna</Dropdown.Item>
                    <Dropdown.Item eventKey="Siatkówka">Siatkówka</Dropdown.Item>
                    <Dropdown.Item eventKey="Hokej na lodzie">Hokej na lodzie</Dropdown.Item>
                    <Dropdown.Item eventKey="Żużel">Żużel</Dropdown.Item>
                    <Dropdown.Item eventKey="Skoki narciarskie">Skoki narciarskie</Dropdown.Item>
                    <Dropdown.Item eventKey="Sporty walki">Sporty walki</Dropdown.Item>
                    <Dropdown.Item eventKey="Koszykówka">Koszykówka</Dropdown.Item>
                    <Dropdown.Item eventKey="Piłka ręczna">Piłka ręczna</Dropdown.Item>
                    <Dropdown.Item eventKey="Rugby">Rugby</Dropdown.Item>
                </Dropdown.Menu>    
            ); 
        }else if(theType === 'Spektakle'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Komedia">Komedia</Dropdown.Item>
                    <Dropdown.Item eventKey="Tragedia">Tragedia</Dropdown.Item>
                    <Dropdown.Item eventKey="Melodramat">Melodramat</Dropdown.Item>
                    <Dropdown.Item eventKey="Adaptacja">Adaptacja</Dropdown.Item>
                    <Dropdown.Item eventKey="Musical">Musical</Dropdown.Item>
                </Dropdown.Menu>    
            );
        }else if(theType === 'Plenerowe'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Festiwale muzyczne">Festiwale muzyczne</Dropdown.Item>
                    <Dropdown.Item eventKey="Festyny">Festyny</Dropdown.Item>
                    <Dropdown.Item eventKey="Jarmarki">Jarmarki</Dropdown.Item>
                </Dropdown.Menu>
            );   
        }else if(theType ==='Muzealne'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Wystawa">Wystawa</Dropdown.Item>
                    <Dropdown.Item eventKey="Wernisaż/Finisaż">Wernisaż/Finisaż</Dropdown.Item>
                </Dropdown.Menu>
            );  
        }else if(theType === 'Konwenty'){
            setGenreContent(
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Komiksy">Komiksy</Dropdown.Item>
                    <Dropdown.Item eventKey="Technologia">Technologia</Dropdown.Item>
                </Dropdown.Menu> 
            );       
        }
        setEventType(theType);
    }
    const handleEventGenre = (value) =>  {
        setEventGenre(value);
    }
    const searchAction = () => {
        console.log(typeof eventGenre)
        console.log(typeof eventType)
        const filtered =   search || eventGenre !== "Gatunek" || eventType !== "Rodzaj" ? companies.filter(item =>(search && (item.name.toLowerCase().includes(search.toLowerCase()) ||item.tags.toLowerCase().includes(search.toLowerCase()))) || (eventGenre !== "Gatunek" && item.tags.toLowerCase().includes(eventGenre.toLowerCase()))): companies;
        const pages = filtered.map((item, index) => ({company: item, page: Math.floor(index / 30)}));
        const maxPage = Math.max(0, ...pages.map(item => item.page));
        setSearchResult(filtered);
        setCompanyPages(pages);
        setPageMax(maxPage);
        setCurrentPage(0);
        setGenreContent(<></>)
        setEventGenre("Gatunek")
        setEventType("Rodzaj")
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
                    headingText="Organizatorzy" 
                    subheadingText = "Szukaj organizatorów" />
            </section>
            <section>
                <form>
                    <ArtistSearchSection
                        setTypeSelect={handleTypeSelection}
                        type={eventType}
                        setGenreSelect={handleEventGenre}
                        genre={eventGenre}
                        menuContent={genreContent}
                        searchAction={searchAction}
                        handleSearch={handleSearch}
                        searchText={search}/>
                </form>
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

export default CompanySearch;