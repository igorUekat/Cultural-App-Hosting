import React from 'react';
import {useState} from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../api';
import { CURRENT_USER, TEMPORARY_USER_ID } from '../constants';

function RegisterCompanyPage() {
  console.log(localStorage.getItem(TEMPORARY_USER_ID))
  const joinAddress = (town, street, zipcode) => {
    return `${street}, ${zipcode} ${town}`
  }
  const innerWidth = window.innerWidth
  const nipRegex = /^\d{10}$/
  const townRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/;
  const zipCodeRegex = /^[0-9]{2}-[0-9]{3}$/
  const streetRegex = /(?:ul\.|ulica|al\.|pl\.)\s+([A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż\s\-]+)\s+(\d+[a-zA-Z]?)(?:\/\d+)?/
  const regonRegex = /^\d{9}(\d{5})?$/
  const [name, setName] = useState("")
  const handleName = (e) =>{
    setName(e.target.value);
  }
  const [nipNumber, setNipNumber] = useState("")
  const [isNipCorrect, setIsNipCorrect] = useState(true)
  const checkIsNipCorrect =  (value) => {
    const isValid = nipRegex.test(value);
    setIsNipCorrect(isValid)
  }
  const handleNipNumber = (e) => {
    const value = e.target.value;
    setNipNumber(value)
    checkIsNipCorrect(value)
  }
  const[street, setStreet] = useState("ul.")
  const[isStreetCorrect, setIsStreetCorrect] = useState(true);
  const checkIsStreetCorrect = (value) =>{
    const isValid = streetRegex.test(value);
    setIsStreetCorrect(isValid)
  }
  const handleStreet = (e) =>{
    const value = e.target.value;
    setStreet(value)
    checkIsStreetCorrect(value)
  } 
  const[town, setTown] = useState("")
  const[isTownCorrect, setIsTownCorrect] = useState(true)
  const checkIsTownCorrect = (value) => {
    const isValid = townRegex.test(value);
    setIsTownCorrect(isValid)
  }
  const handleTown = (e) =>{
    const value = e.target.value;
    setTown(value)
    checkIsTownCorrect(value)
  }
  const [zipCode, setZipCode] = useState("")
  const [isZipCodeCorrect, setIsZipCodeCorrect] = useState(true)
  const checkIsZipCodeCorrect = (value) =>{
    const isValid = zipCodeRegex.test(value);
    setIsZipCodeCorrect(isValid)
  }
  const handleZipCode = (e) => {
    const value = e.target.value
    setZipCode(value)
    checkIsZipCodeCorrect(value)
  }
  const [regon, setRegon] = useState("");
  const [isRegonCorrect, setIsRegonCorrect] = useState(true)
  const checkIsRegonCorrect = (value)=>{
    const isValid = regonRegex.test(value);
    setIsRegonCorrect(isValid)
  }
  const handleRegon = (e) =>{
    const value = e.target.value
    setRegon(value)
    checkIsRegonCorrect(value)
  }
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyOwner = localStorage.getItem(TEMPORARY_USER_ID)
    if (!name || !nipNumber || !isNipCorrect || !street || street === "ul." || !isStreetCorrect || !town || !isTownCorrect || !zipCode || !isZipCodeCorrect || !regon || !isRegonCorrect){
      setErrorMessage("Wszystkie pola powinny być wypełnione")
      return
    }
    else if(!companyOwner){
        window.location.replace("/#/register_company_account_page");
        return
    }
    setLoading(true)
    setErrorMessage("")
    try{
      const address = joinAddress(town, street, zipCode)
      const response = await api.post("api/create_company/", { name, address, nipNumber, regon});
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem(CURRENT_USER, null);
        window.location.replace("/#/login");
      } else {
        setErrorMessage("Error: " + (response.data?.error || "Nieznany błąd"));
      }
    }catch(err) {
      setErrorMessage(err.response?.data?.error || err.message || "Wystąpił błąd podczas rejestracji");
    }finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-container">
      <header>
        <div className="login-bg">
          <div className="login-bg-overlay">
            <a href="/">
              <img src="/Logo.svg" height="150px"/>
            </a>
          </div>
        </div>
      </header>
      <main>
        <div className="login-form-container">
          {innerWidth < 600 && <a href="/">
              <img src="/LogoPurple.svg" height="100px"/>
            </a>}
          <Form onSubmit={handleSubmit} className="w-75">
            <h2 className="text-center" style={{fontFamily: 'Dm-Sans-Bold'}}>Witaj! Stwórz profil firmy</h2>
            <Form.Group className="mb-1 text-center">
              <Form.Label>Nazwa firmy</Form.Label>
              <Form.Control className="login-form-control" onChange={handleName}/>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Label>NIP firmy</Form.Label>
              <Form.Control className="login-form-control" onChange={handleNipNumber}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isNipCorrect ? 'none' : 'block'}}>
                NIP jest niepoprawny
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Label>Numer Regon</Form.Label>
              <Form.Control className="login-form-control" onChange={handleRegon}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isRegonCorrect ? 'none' : 'block'}}>
                Regon jest niepoprawny
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Label>Ulica</Form.Label>
              <Form.Control className="login-form-control" value={street} onChange={handleStreet}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isStreetCorrect ? 'none' : 'block'}}>
                Niepoprawna ulica
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Label>Miasto</Form.Label>
              <Form.Control className="login-form-control" onChange={handleTown}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isTownCorrect ? 'none' : 'block'}}>
                Niepoprawna nazwa miasta
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Label>Kod pocztowy</Form.Label>
              <Form.Control className="login-form-control" onChange={handleZipCode}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isZipCodeCorrect ? 'none' : 'block'}}>
                Nieprawidłowy kod pocztowy
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-1 text-center">
              <Form.Text className="text-muted login-form-control-error" style={{display: errorMessage ? 'block' : 'none'}}>
                {errorMessage}
              </Form.Text>   
            </Form.Group>       
            <Button variant="primary" type="submit" className="w-100 login-button">
              Zarejestruj firmę
            </Button>
            <div style={{margin: '10px', display: loading ? 'flex' : 'none', flexDirection: 'column', alignItems: "center"}}>
              <Spinner animation="border" />
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

export default RegisterCompanyPage;