import React from 'react';
import LoggedNavBar from '../components/LoggedNavBar'
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';
import EventHolder from '../components/EventHolder';
import Pagi from '../components/Pagi';
import MiniHero from '../components/MiniHero';
import MenuOffcanvas from '../components/MenuOffcanvas';
import EventCard from '../components/EventCard';
import { Dropdown } from 'react-bootstrap';
import { isUserLogged, getDistance } from '../globalFuns';
import { useState, useEffect } from 'react'
import { EVENTS, PHOTOS, USER_LATITUDE, USER_LONGITUDE } from '../constants';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';
function EventList(){
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
    const innerWidth = window.innerWidth
    const events = JSON.parse(localStorage.getItem(EVENTS))
    const now = new Date()
    const currentEvents = events?.filter(item => new Date(item.dateSecond) > now && item.isActive && !item.soldOut).sort((a, b) => new Date(a.date) - new Date(b.date))
    const [eventPages, setEventPages] = useState(currentEvents?.map((item, index) => ({event: item, page: Math.floor(index/5)})))
    const [pagesMax, setPageMax] = useState(Math.max(0,...eventPages?.map(item => item.page)))
    const [currentPage, setCurrentPage] = useState(0)
    const handleCurrentPage = (value) => {
        setCurrentPage(value)
        window.scrollTo({ top: window.innerHeight, left: 0, behavior: "instant" });
    }
    const [searchResult, setSearchResult] = useState(events) 
    const photos = JSON.parse(localStorage.getItem(PHOTOS)).sort((a, b) => a.id - b.id)
    const [distance, setDistance] = useState("");
    const [dateMin, setDateMin] = useState();
    const [dateMax, setDateMax] = useState();
    const [priceMin, setPriceMin] = useState("0");
    const [priceMax, setPriceMax] = useState("999999");
    const [search, setSearch] = useState("");
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const handleDistance = (e) =>{
        setDistance(e.target.value);
    };
    const handleDateMin = (e) =>{
        setDateMin(e.target.value)
    };
    const handleDateMax = (e) =>{
        setDateMax(e.target.value)
    };
    const handlePriceMin = (e) =>{
        setPriceMin(e.target.value);
    };
    const handlePriceMax = (e) =>{
        setPriceMax(e.target.value);
    };
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    const handleSortCriteria = (e) =>{
        setSortCriteria(e.target.value);
    };
    const handleSortDirection = (e) =>{
        setSortDirection(e.target.value);
    };
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
        console.log(value)
    }
    const searchAction = () => {
        let filtered = search || eventGenre !== "Gatunek" || eventType !== "Rodzaj" ? currentEvents.filter(item => search && (item.name.toLowerCase().includes(search.toLowerCase()) || item.tags.toLowerCase().includes(search.toLowerCase())) || ((eventGenre !== "Gatunek" && item.tags.toLowerCase().includes(eventGenre.toLowerCase())))): currentEvents;
        if(distance && Number(distance) > 0 && localStorage.getItem(USER_LATITUDE) > 0 && localStorage.getItem(USER_LONGITUDE) > 0 ){
            const userLat = Number(localStorage.getItem(USER_LATITUDE))
            const userLon = Number(localStorage.getItem(USER_LONGITUDE))
            filtered = filtered.filter(item => getDistance(userLat, userLon, Number(item.latitude), Number(item.longitude)) <= Number(distance))
        }
        if(priceMin <= priceMax){
            filtered = filtered.filter(item => item.lowestPriceNorm >= priceMin && item.lowestPriceNorm <= priceMax)
        }
        if(dateMin && !dateMax){
            filtered = filtered.filter(item => new Date(item.date) >= new Date(dateMin))           
        }
        if(!dateMin && dateMax){
            filtered = filtered.filter(item => new Date(item.dateSecond) <= new Date(dateMax)) 
        }
        if(dateMin && dateMax){
            filtered = filtered.filter(item => new Date(item.date) >= new Date(dateMin) && new Date(item.dateSecond) <= new Date(dateMax)) 
        }
        if(sortCriteria){
            if(sortCriteria === "price"){
                filtered = filtered.sort((a, b) => Number(a.lowestPriceNorm) - Number(b.lowestPriceNorm))
            }else if(sortCriteria === "popularity"){
                filtered = filtered.sort((a, b) => Number(a.numberOfFollowers) - Number(b.numberOfFollowers))
            }else{
                filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
            }
        }
        if(sortDirection === "decreasing"){
            filtered = filtered.reverse()
        }
        const pages = filtered.map((item, index) => ({event: item, page: Math.floor(index / 5)}));
        const maxPage = Math.max(0, ...pages.map(item => item.page));
        setSearchResult(filtered);
        setEventPages(pages);
        setPageMax(maxPage);
        setCurrentPage(0);
        setGenreContent(<></>)
        setEventGenre("Gatunek")
        setEventType("Rodzaj")
        window.scrollTo({ top: window.innerHeight, left: 0, behavior: "smooth" });
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
                    headingText="Wydazrenia" 
                    subheadingText = "Szukaj wydarzeń" />
            </section>
            <form>
                <SearchSection
                    distance={distance}
                    handleDistance={handleDistance}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    handlePriceMin={handlePriceMin}
                    handlePriceMax={handlePriceMax}
                    dateMin={dateMin}
                    dateMax={dateMax}
                    handleDateMin={handleDateMin}
                    handleDateMax={handleDateMax}
                    search={search}
                    handleSearch={handleSearch}
                    sortCriteria={sortCriteria}
                    sortDirection={sortDirection}
                    handleSortDirection={handleSortDirection}
                    handleSortCriteria={handleSortCriteria}
                    eventType={eventType}
                    genreContent={genreContent}
                    eventGenre={eventGenre}
                    handleTypeSelection={handleTypeSelection}
                    handleEventGenre={handleEventGenre}
                    searchAction={searchAction}
                />
            </form>
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

export default EventList;