import React from 'react';
import {useState} from 'react';
import {Navigate} from 'react-router-dom'
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import api from "../api"

function RegisterAccountPage() {
  const createUsername = (nick) =>{
    return email.split('@')[0];
  }
  const innerWidth = window.innerWidth
  const emailRegex = new RegExp("^[a-zA-Z][a-zA-Z.-]*@[a-zA-Z.-]+\\.[a-zA-Z]{2,}$");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  const [email, setEmail] = useState("");
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const checkIsEmailCorrect = (value) => {
    const isValid = emailRegex.test(value);
    setIsEmailCorrect(isValid);
  }
  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    checkIsEmailCorrect(value);
  }

  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [isPasswordLong, setIsPasswordLong] = useState(true);
  const checkIsPasswordCorrect = (value) => {
    const isValid = passwordRegex.test(value);
    setIsPasswordCorrect(isValid);
  };
  const checkIsPasswordLong = (value) => {
    const isValid = value.length >= 8;
    setIsPasswordLong(isValid);
  };


  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const checkPasswordMatch = (value) => {
    const isValid = value === password;
    setPasswordMatch(isValid);
  };
  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkIsPasswordCorrect(value);
    checkIsPasswordLong(value);
    checkPasswordMatch(value);
  };
  const handleRepeatPassword = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    checkPasswordMatch(value);
  };
  const[showPassword, setShowPassword] = useState(false);
  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked);
  }
  const[loading, setLoading] = useState(false);
  const[errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !isEmailCorrect || !password || !isPasswordCorrect || !isPasswordLong || !repeatPassword || !passwordMatch){
      setErrorMessage("Wszystkie pola muszą być uzupełnione poprawnie");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const username = createUsername(email);
      const response = await api.post("/api/register/", { username, email, password });
      if (response.status === 200 || response.status === 201) {
        console.log("success");
        window.location.replace("/#/login");
      } else {
        setErrorMessage("Error: " + (response.data?.error || "Nieznany błąd"));
      }
    } catch(err) {
      setErrorMessage(err.response?.data?.error || err.message || "Wystąpił błąd podczas rejestracji");
    } finally {
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
            <h2 className="text-center" style={{fontFamily: 'Dm-Sans-Bold'}}>Stwórz konto</h2>
            <Form.Group className="mb-3 text-center" controlId="formBasicEmail">
              <Form.Label>Podaj swój e-mail</Form.Label>
              <Form.Control className="login-form-control" onChange={handleEmail}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isEmailCorrect ? 'none' : 'block'}}>
                e-mail jest niepoprawny
              </Form.Text>
            </Form.Group>        
            <Form.Group className="mb-3 text-center" controlId="formBasicPassword">
              <Form.Label>Podaj hasło</Form.Label>
              <Form.Control className="login-form-control" type={showPassword ? '' : 'password'} onChange={handlePassword}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isPasswordCorrect ? 'none' : 'block'}}>
                Hasło powinno zawierać co najmniej: jedną dużą literę, jedną cyfrę, oraz jeden znak specjalny (!,?,@ itp.)
              </Form.Text>
              <br/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isPasswordLong ? 'none' : 'block'}}>
                Hasło powinno zawierać co najmniej 8 znaków 
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3 text-center" controlId="formBasicPassword">
              <Form.Label>Powtórz hasło</Form.Label>
              <Form.Control className="login-form-control" type={showPassword ? '' : 'password'} onChange={handleRepeatPassword}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: passwordMatch ? 'none' : 'block'}}>
                Hasła się nie zgadzają
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check className="create-event-check" type="checkbox" label="Pokaż hasło" checked={showPassword} onChange={handleShowPassword}/>
            </Form.Group>
            <Form.Text className="text-muted login-form-control-error" style={{display: errorMessage ? 'block' : 'error'}}>
              {errorMessage}
            </Form.Text>
            <Button variant="primary" type="submit" className="w-100 login-button">
              Stwórz konto
            </Button>
            <div style={{margin: '10px', display: loading ? 'flex' : 'none', flexDirection: 'column', alignItems: "center"}}>
              <Spinner animation="border" />
            </div>
          </Form>
          <a href="/#/login">Mam już konto</a>
        </div>
      </main>
    </div>
  );
}
export default RegisterAccountPage;