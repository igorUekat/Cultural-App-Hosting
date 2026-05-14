import React from "react";
import { Offcanvas, Button, Modal, Form, Dropdown, Alert, Badge} from "react-bootstrap";
import { useState, useEffect } from "react";
import { RetrieveLocation, getUserNotifications} from "../globalFuns";
import { USER_LATITUDE, USER_LONGITUDE,CURRENT_USER} from "../constants";
import api from "../api";
import {useNavigate} from 'react-router-dom'
import LocationModal from "./LocationModal";
function LoggedMenuOffcanvas(){
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
    }
    const [showCanvas, setShowCanvas] = useState(false)
    const handleShowCanvas = () =>{
        setShowCanvas(true)
    }
    const handleCloseCanvas = () =>{
        setShowCanvas(false)
    }
  return(
    <>
    <a onClick={handleShowCanvas} className="social-media-circle"><img src="/burger.svg"/></a>
    <Offcanvas show={showCanvas} onHide={handleCloseCanvas} className="nav-offcanvas">
        <Offcanvas.Header>
          <a href="/"><img src="/Logo.svg" height='60px' alt="Strona główna"/></a>
        </Offcanvas.Header>
        <Offcanvas.Body style={{display: 'flex', flexDirection:"column"}}>
          <a href="/#/event_list" className="nav-offcanvas-a">Wydarzenia</a>
          <a href="/#/artist_search" className="nav-offcanvas-a">Artyści</a>
          <a href="/#/company_search" className="nav-offcanvas-a">Organizatorzy</a>
          <a onClick={handleShow} className="nav-offcanvas-a">Twoja lokalizacja</a>
          <a href="/#/user_page" className="nav-offcanvas-a">Twoje konto</a>
          <a onClick={handleNotification} className="nav-offcanvas-a">Twoje powiadomienia</a>
          {notifications.length > 0 && <Badge bg="danger" className="navbar-badge" pill>{notifications.length}</Badge>}
          <a href="/#/logout" className="nav-offcanvas-a">Wyloguj się</a>
        </Offcanvas.Body>
    </Offcanvas>
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


export default LoggedMenuOffcanvas