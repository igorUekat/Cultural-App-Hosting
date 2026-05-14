import React from "react";
import "../style.css";
import { useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Alert from 'react-bootstrap/Alert';
import { RetrieveLocation } from "../globalFuns";
import { USER_LATITUDE, CURRENT_USER, USER_LONGITUDE } from "../constants";
import LocationModal from "./LocationModal";
import api from "../api";

function NavBar(){
    const [showIcon, setShowIcon] = useState("/location-purple.svg");
    const mouseOn = () => setShowIcon("/location-lime.svg");
    const mouseOut  = () => setShowIcon("/location-purple.svg");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const townRegex = new RegExp("^[A-Za-z\\s-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$");    
    const [voivod, setVoivod] = useState("Województwo:");
    const selectVoivod = (value) => {
        setVoivod(value);
    };
    const [townName, setTownName] = useState("");
    const handleUserInput = (e) =>{
        setTownName(e.target.value);
    };
    async function GetLocation(town, voivod, retries = 2){
        for (let i = 0; i < retries; i++) {
            try {
                const location = await RetrieveLocation(town, voivod);
                if (location && location.lat && location.lon) {
                    return location;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1} failed:`, error.message);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    const [errorMessage, setErrorMessage] = useState("");
    const handleErrorMessage = async() =>{
        if(!townName || !townRegex.test(townName)){
            setErrorMessage("Nieprawidłowa nazwa miasta. Nazwa może zawierać jedynie litery, spacje lub myślniki");
        }else if(voivod === "Województwo:"){
            setErrorMessage("Musisz wybrać województwo, w którym znajduje się miejscowość");
        }else{
            const location = await GetLocation(townName, voivod)
            const longitude = parseFloat(location.lon).toFixed(5)
            const latitude = parseFloat(location.lat).toFixed(5)
            localStorage.setItem(USER_LATITUDE, latitude)
            localStorage.setItem(USER_LONGITUDE, longitude)
            setErrorMessage("");
            handleClose();
            window.location.reload();
        }
    }
    return(
        <>
        <Navbar fixed="top" className="navbar-container" as="nav">
            <Nav className="w-100 justify-content-between align-items-center" activeKey="/home" bsPrefix="nav navbar-container">
                <Nav.Item bsPrefix='nav-link navbar-image navbar-item'>
                    <Nav.Link href="/"><img src="/Logo.svg" height='75px' alt="Strona główna"/></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/#/artist_search" bsPrefix='nav-link navbar-link'>Artyści</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/#/event_list" bsPrefix='nav-link navbar-link'>Wydarzenia</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/#/company_search" bsPrefix='nav-link navbar-link'>Organizatorzy</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <ButtonGroup bsPrefix="btn-group navbar-button-group">
                        <Button variant="secondary" bsPrefix="btn navbar-button" onClick={handleShow} onMouseOver={mouseOn} onMouseLeave={mouseOut}><img src={showIcon} alt="Wybierz swoją lokację"/></Button>
                        <Button variant="secondary" bsPrefix="btn navbar-button" href="/#/login" style={{display: 'flex', flexDirection: 'column', justifyContent:'center'}}>Zaloguj się</Button>
                    </ButtonGroup>
                </Nav.Item>
            </Nav>
        </Navbar>
        <LocationModal
            show={show}
            handleClose={handleClose}
            townName={townName}
            handleUserInput={handleUserInput}
            selectVoivod={selectVoivod}
            voivod={voivod}
            errorMessage={errorMessage}
            handleErrorMessage={handleErrorMessage}
            handleClose={handleClose}
        />     
        </>
    );
}
export default NavBar;