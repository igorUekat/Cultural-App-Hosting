import React from "react";
import { Offcanvas, Button, Modal, Form, Dropdown, Alert} from "react-bootstrap";
import { useState } from "react";
import { RetrieveLocation } from "../globalFuns";
import { USER_LATITUDE, USER_LONGITUDE} from "../constants";
import LocationModal from "./LocationModal";
import api from "../api";

function MenuOffcanvas(){
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
          location.reload()
      }
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
          <a href="/#/main_page"><img src="/Logo.svg" height='60px' alt="Strona główna"/></a>
        </Offcanvas.Header>
        <Offcanvas.Body style={{display: 'flex', flexDirection:"column"}}>
          <a href="/#/event_list" className="nav-offcanvas-a">Wydarzenia</a>
          <a href="/#/artist_search" className="nav-offcanvas-a">Artyści</a>
          <a href="/#/company_search" className="nav-offcanvas-a">Organizatorzy</a>
          <a onClick={handleShow} className="nav-offcanvas-a">Twoja lokalizacja</a>
          <a href="/#/login" className="nav-offcanvas-a">Zaloguj się</a>
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


export default MenuOffcanvas
//onHide={handleClose}  {...props}