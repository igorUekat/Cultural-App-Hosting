import React from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import {useState} from 'react'
import {CURRENT_USER, USERS_COMPANY, USER_LATITUDE, USER_LONGITUDE, SUPPOSED_TO_BE_LOGGED} from '../constants';
import {ClearData} from '../globalFuns'
import api from '../api';
function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const innerWidth = window.innerWidth
  const handleLogin = (e) => {
    setLogin(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const[loading, setLoading] = useState(false);
  const[errorMessage, setErrorMessage] = useState("");  
  const[showPassword, setShowPassword] = useState(false);
  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked);
  }
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!login || !password) {
          setErrorMessage("Wszystkie pola muszą być uzupełnione poprawnie");
          return;
      }
      setLoading(true);
      setErrorMessage("");
      try {
          const response = await api.post("/api/login/", { login, password });
          const user = response.data.user;
          if (user.is_active === false) {
              setErrorMessage("Twoje konto zostało zdezaktywowane");
              return;
          }
          localStorage.setItem(CURRENT_USER, JSON.stringify(user))
          localStorage.setItem(USER_LATITUDE, user.latitude)
          localStorage.setItem(USER_LONGITUDE, user.longitude)
          if (user.company_id) {
              const companyResponse = await api.get(`/api/get_company/${user.company_id}/`)
              if (companyResponse.status === 200) {
                  localStorage.setItem(USERS_COMPANY, JSON.stringify(companyResponse.data))
              }
          }
          window.location.replace("/#/logged_main_page");
      } catch (err) {
          setErrorMessage(err.response?.data?.error || err.message || "Wystąpił błąd podczas logowania");
      } finally {
          setLoading(false);
      }
  }
  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-overlay">
          <a href="/">
            <img src="/Logo.svg" height="150px"/>
          </a>
        </div>
      </div>
      <div className="login-form-container">
          {innerWidth < 600 && <a href="/">
                                <img src="/LogoPurple.svg" height="100px"/>
                              </a>}
        <Form onSubmit={handleSubmit} className="w-75">
          <h2 className="text-center" style={{fontFamily: 'Dm-Sans-Bold'}}>Witaj ponownie!</h2>
          <Form.Group className="mb-3 text-center" controlId="formBasicEmail">
            <Form.Label>Adres e-mail</Form.Label>
            <Form.Control className="login-form-control" onChange={handleLogin}/>
          </Form.Group>
          <Form.Group className="mb-3 text-center" controlId="formBasicPassword">
            <Form.Label>Hasło</Form.Label>
            <Form.Control className="login-form-control" type={showPassword ? '' : 'password'} onChange={handlePassword}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check className="create-event-check" type="checkbox" label="Pokaż hasło" checked={showPassword} onChange={handleShowPassword}/>
          </Form.Group>
          <Form.Text className="text-muted login-form-control-error" style={{display: errorMessage ? 'block' : 'none'}}>
            {errorMessage}
          </Form.Text>
          <Button variant="primary" type="submit" className="w-100 login-button">
            Zaloguj
          </Button>
          <div style={{margin: '10px', display: loading ? 'flex' : 'none', flexDirection: 'column', alignItems: "center"}}>
            <Spinner animation="border" />
          </div>
        </Form>
        <a href="/#/choose_account_type">Nie masz konta? Stwórz go teraz!</a>
      </div>
    </div>
  );
}

export default LoginPage;