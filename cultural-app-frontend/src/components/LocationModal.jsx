import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Alert from 'react-bootstrap/Alert';

function LocationModal(props){
    return(
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
                <Modal.Title bsPrefix="modal-title overall-modal-text">Wybierz swoją lokalizację</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Podaj nazwę miejscowości: </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="np. Warszawa"
                            bsPrefix="form-control form-light-color"
                            value={props.townName}
                            onChange={props.handleUserInput}
                        />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label bsPrefix="modal-label overall-modal-text">Województwo:</Form.Label>
                        <Dropdown onSelect={props.selectVoivod}>
                            <Dropdown.Toggle id="dropdown-basic" className="dropdown-toggle modal-dropdown">
                                {props.voivod}
                            </Dropdown.Toggle>
                            <Dropdown.Menu bsPrefix="dropdown-menu modal-dropdown-content-background">
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="dolnośląskie">dolnośląskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="kujawsko-pomorskie">kujawsko-pomorskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="lubelskie">lubelskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="lubuskie">lubuskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="łódzkie">łódzkie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="małopolskie">małopolskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="mazowieckie">mazowieckie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="opolskie">opolskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="podkarpackie">podkarpackie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="podlaskie">podlaskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="pomorskie">pomorskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="śląskie">śląskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="świętokrzyskie">świętokrzyskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="warmińsko-mazurskie">warmińsko-mazurskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="wielkopolskie">wielkopolskie</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="zachodniopomorskie">zachodniopomorskie</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Form>
                <Alert role="alert" key='danger' variant='danger' show={props.errorMessage}>
                    {props.errorMessage}
                </Alert>
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer overall-modal">
            <Button variant="secondary button-dismiss" onClick={props.handleClose}>
                Zamknij
            </Button>
            <Button variant="primary button-accept" onClick={props.handleErrorMessage}>
                Zapisz zmiany
            </Button>
            </Modal.Footer> 
        </Modal>
    )
}
export default LocationModal