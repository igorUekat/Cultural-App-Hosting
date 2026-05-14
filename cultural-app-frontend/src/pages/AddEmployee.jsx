import React from 'react';
import {useState} from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../api';
import { USERS_COMPANY } from '../constants';

function AddEmployee() {
  const companyId = JSON.parse(localStorage.getItem(USERS_COMPANY)).id
  const innerWidth = window.innerWidth
  console.log(companyId)
  const createUsername = (nick) =>{
    return email.split('@')[0];
  }
  const retrieveName = (nameAndUsername) => {
    return nameAndSurname.split(' ')[0];
  }
  const retrieveSurname = (nameAndSurname) =>{
    const nasSplit = nameAndSurname.split(' ');
    return nasSplit[nasSplit.length-1];
  }
  const nameAndSurnameRegex = /^(?!.*\d)[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+ \s*[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/;
  const emailRegex = new RegExp("^[a-zA-Z][a-zA-Z.-]*@[a-zA-Z.-]+\\.[a-zA-Z]{2,}$");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  const [nameAndSurname, setNameAndSurname] = useState("");
  const [isNameAndSurnameCorrect, setIsNameAndSurnameCorrect] = useState(true);
  const checkIsNameAndSurnameCorrect = (value) => {
    const isValid = nameAndSurnameRegex.test(value);
    setIsNameAndSurnameCorrect(isValid);
  }
  const handleNameAndSurname = (e) => {
    const value = e.target.value;
    setNameAndSurname(value);
    checkIsNameAndSurnameCorrect(value);
  }

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
    console.log(`password is correct ${isValid}`);
  };
  const checkIsPasswordLong = (value) => {
    const isValid = value.length >= 8;
    setIsPasswordLong(isValid);
    console.log(`password is long ${isValid}`);
  };
  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkIsPasswordCorrect(value);
    checkIsPasswordLong(value);
  };

  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const checkPasswordMatch = (value) => {
    const isValid = value === password;
    setPasswordMatch(isValid);
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
  const handleSubmit = async (e) =>{
    e.preventDefault()
    if(!nameAndSurname || !isNameAndSurnameCorrect || !email || !isEmailCorrect || !password || !isPasswordCorrect || !isPasswordLong || !repeatPassword || !passwordMatch){
      setErrorMessage("Wszystkie pola muszą być uzupełnione")
      return;
    }
    setLoading(true);
    try{
      const username = createUsername(email);
      const first_name = retrieveName(nameAndSurname);
      const last_name = retrieveSurname(nameAndSurname);
      const companyRole = "Employee"
      const response = await api.post("/api/register_employee/", { username, email, password, first_name, last_name, companyRole, company: companyId });
      if (response.status === 200 || response.status === 201) {
        window.location.replace("/#/employees_page");
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
          <Form onSubmit={handleSubmit} className="w-75">
            <h2 className="text-center" style={{fontFamily: 'Dm-Sans-Bold'}}>Stwórz konto pracownika</h2>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Imię i nazwisko Pracownika</Form.Label>
              <Form.Control className="login-form-control" onChange={handleNameAndSurname}/>
              <Form.Text className="text-muted login-form-control-error" style={{display: isNameAndSurnameCorrect ? 'none' : 'block'}}>
                Imię i nazwisko są niepoprawne <br/> Imię i nazwisko powinno zawierać co najmniej jedną spację
              </Form.Text>
            </Form.Group> 
            <Form.Group className="mb-3 text-center" controlId="formBasicEmail">
              <Form.Label>Podaj e-mail pracownika</Form.Label>
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
            <Form.Text className="text-muted login-form-control-error" style={{display: errorMessage ? 'block' : 'none'}}>
              {errorMessage}
            </Form.Text>
            <Button variant="primary" type="submit" className="w-100 login-button">
              Dodaj pracownika
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
export default AddEmployee;