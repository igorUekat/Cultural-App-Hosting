import React from "react";
import "../style.css";
import { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { RetrieveLocation, getUserNotifications } from "../globalFuns";
import { USER_LATITUDE, USER_LONGITUDE, CURRENT_USER } from "../constants";
import api from "../api";
import {useNavigate} from 'react-router-dom'
import LocationModal from "./LocationModal";

function LoggedNavBar(){
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        const action = async () => {
            const result = await getUserNotifications(user);
            setNotifications(result)
        };
        action();
    }, []);
    const townRegex = new RegExp("^[A-Za-z\\s-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$");
    const [showLocationIcon, setShowLocationIcon] = useState("/location-purple.svg");
    const [showAccountIcon, setShowAccountIcon] = useState("/account-purple.svg");
    const [showNotificationIcon, setShowNotificationIcon] = useState("/notification-purple.svg");
    const [showLogoutIcon, setShowLogoutIcon] = useState("/logout-purple.svg");
    const locationMouseOn = () => setShowLocationIcon("/location-lime.svg");
    const locationMouseOut  = () => setShowLocationIcon("/location-purple.svg");
    const accountMouseOn = () => setShowAccountIcon("/account-lime.svg");
    const accountMouseOut  = () => setShowAccountIcon("/account-purple.svg");
    const notificationMouseOn = () => setShowNotificationIcon("/notification-lime.svg");
    const notificationMouseOut  = () => setShowNotificationIcon("/notification-purple.svg");
    const logoutMouseOn = () => setShowLogoutIcon("/logout-lime.svg");
    const logoutMouseOut  = () => setShowLogoutIcon("/logout-purple.svg");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [voivod, setVoivod] = useState("Województwo:");
    const selectVoivod = (value) => {
        setVoivod(value);
    };
    const [townName, setTownName] = useState("");
    const handleUserInput = (e) =>{
        setTownName(e.target.value);
    };
    const userId = user.id
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
    const handleErrorMessage = async () =>{
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
            const payload = {longitude: longitude, latitude: latitude}
            const res = await api.patch(`/api/update_user/`, payload)
            if(res.status === 200 || res.status === 201){
                setErrorMessage("");
                handleClose();
                location.reload()
            }else{
                setErrorMessage("Coś poszło nie tak");  
            }
        }
    }
    const navigate = useNavigate()
    const handleNotification = () =>{
        navigate("/notification_page", {state: {notifications}})
        setNotifications([])
    }
    return(
        <>
        <Navbar fixed="top">
            <Nav className="w-100 logged-navbar-container">
                <Nav.Item bsPrefix='nav-link navbar-image navbar-item'>
                    <Nav.Link href="/#/logged_main_page"><img src="/Logo.svg" height='75px' alt="Strona główna"/></Nav.Link>
                </Nav.Item>
                <div className="w-50" style={{marginLeft: "6rem",display: 'flex', direction: 'row', justifyContent: 'space-between'}}>
                    <Nav.Item>
                        <Nav.Link href="/#/artist_search" bsPrefix='nav-link navbar-link'>Artyści</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/#/event_list" bsPrefix='nav-link navbar-link'>Wydarzenia</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/#/company_search" bsPrefix='nav-link navbar-link'>Organizatorzy</Nav.Link>
                    </Nav.Item>
                </div>
                <Nav.Item>
                    <ButtonGroup bsPrefix="btn-group navbar-button-group">
                        <Button variant="secondary" bsPrefix="btn navbar-button" onClick={handleShow} onMouseOver={locationMouseOn} onMouseLeave={locationMouseOut}><img src={showLocationIcon} alt="Wybierz swoją lokację"/></Button>
                        <Button variant="secondary" bsPrefix="btn navbar-button" href="/#/user_page" onMouseOver={accountMouseOn} onMouseLeave={accountMouseOut}><img src={showAccountIcon} alt="Twoje konto"/></Button>
                        <Button variant="secondary" bsPrefix="btn navbar-button" href="/#/notification_page" onMouseOver={notificationMouseOn} onMouseLeave={notificationMouseOut} onClick={handleNotification}><img src={showNotificationIcon} alt="Twoje powiadomienia"/>{notifications && notifications.length !== 0 && <Badge bg="danger" className="navbar-badge" pill>{notifications.length}</Badge>}</Button>
                        <Button variant="secondary" bsPrefix="btn navbar-button" href="/#/logout" onMouseOver={logoutMouseOn} onMouseLeave={logoutMouseOut}><img src={showLogoutIcon} alt="Wyloguj się"/></Button>
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
export default LoggedNavBar;