import React from 'react';
import MiniHero from '../components/MiniHero';
import LoggedNavBar from '../components/LoggedNavBar';
import Footer from '../components/Footer';
import {Button} from 'react-bootstrap';
import ConfirmationModal from '../page_elements/CompanyEventList/ConfirmationModal';
import DropdownModal from '../page_elements/EmployeesPage/DropdownModal';
import {useState, useEffect} from 'react';
import { CURRENT_USER, USERS_COMPANY, EVENTS, PHOTOS } from '../constants';
import api from '../api';
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function EmployeesPage(){
    useEffect(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
    const [employees, setEmployees] = useState([])
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    useEffect(() => {
        const action = async () =>{
            const response = await api.get(`/api/get_employees/`)
            if(response.status === 200 || response.status === 201){
                setEmployees(response.data.filter(item => item.is_active))
            }
        }
        action()
    }, [])
    function translateRole(name){
        if(name === "Owner"){
            return "Właściciel"
        }else if(name === "Admin"){
            return "Administrator"
        }else{
            return "Pracownik"
        }
    }
    const [currentId, setCurrentId] = useState(0)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleShowDeleteModal = (id) => {
        setCurrentId(id)
        setShowDeleteModal(true);
    }
    const closeDeleteModal = () => {
        setCurrentId(0)
        setShowDeleteModal(false);
    }
    const deleteAction = async () =>{
        const payload = {is_active: false, company: null, companyRole: null}
        const response = await api.patch(`/api/update_employee/${currentId}/`, payload)
        if(response.status === 200 || response.status === 201){
            console.log("Zaaktualizowano pomyślnie")
            setCurrentId(0)
            closeDeleteModal();
            location.reload();
        }
    }
    const [showRolesModal, setShowRolesModal] = useState(false);
    const handleShowRolesModal = (id) => {
        setCurrentId(id)
        setShowRolesModal(true);
    }
    const closeRolesModal = () => {
        setCurrentId(0)
        setShowRolesModal(false);
    }
    const [role, setRole] = useState("Employee");
    const handleRole = (value) =>{
        setRole(value);
    }
    const handleRoleAction = async()=>{
        const payload = {companyRole: role}
        const response = await api.patch(`/api/update_employee/${currentId}/`, payload)
        if(response.status === 200 || response.status === 201){
            console.log("Zaaktualizowano pomyślnie")
            setCurrentId(0)
            closeRolesModal();
            location.reload();
        }
    }
    return(
        <>
        <header>
            <LoggedNavBar/>
        </header>
        <nav>
            <LoggedMenuOffcanvas/>
        </nav>
        <main>
        <section>
            <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
            headingSpecial={false} 
            subheadingDisplayed={true}
            headingText="Pracownicy"/>
        </section>
        <section>
            <div className="employee-list-container">
                <p>Wszyscy pracownicy w firmie mogą tworzyć wydarzenia. 
                <br/>Administratorzy i właściciel natomiast mogą usuwać wydarzenia.
                <br/>Tylko właściciel firmy może zarządzać pracownikami</p>
                {user.companyRole === "Owner" && <Button className="event-page-main-button" href="/#/add_employee">
                    Dodaj pracownika
                </Button>}
                <div className="employee-and-edit-container">
                {employees.map((item, index) =>(
                    <React.Fragment key={`${index}`}>
                        <div className="employee-container">
                            <img src="/account-purple.svg"/>
                            <p className="employee-container-name">{`${item.first_name} ${item.last_name}`}</p>
                            <p className="employee-container-role">{`${translateRole(item.companyRole)}`}</p>
                        </div>
                        {(item.id !== user.id && user.companyRole === "Owner") && <div className="employee-edit-container">
                            <a onClick={() => handleShowRolesModal(item.id)}>Zmień rolę</a>
                            <a onClick={() => handleShowDeleteModal(item.id)}>Zwolnij pracownika</a>
                        </div>}
                    </React.Fragment>
                ))}
                </div>
            </div>
        </section>
        </main>
        <ConfirmationModal 
            modalShow={showDeleteModal}
            handleClose={closeDeleteModal}
            notificationText="Zwolnij pracownika"
            info="Czy na pewno chcesz usunąć pracownika z firmy? procedura jest nieodwracalna"
            handleAction={deleteAction}/>
        <DropdownModal
            modalShow={showRolesModal}
            handleClose={closeRolesModal}
            modalHeading="Wybierz rolę dla wybranego pracownika"
            selectFunction={handleRole}
            selectValue={role}
            handleAction={handleRoleAction}/>
        <Footer/>
        </>
    );
}

export default EmployeesPage;