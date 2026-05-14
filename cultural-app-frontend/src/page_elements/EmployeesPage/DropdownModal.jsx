import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function DropdownModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
                <Modal.Title bsPrefix="modal-title overall-modal-text">{props.modalHeading}</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Dropdown onSelect={props.selectFunction}>
                    <Dropdown.Toggle id="dropdown-basic" className="dropdown-toggle modal-dropdown">
                        {props.selectValue}
                    </Dropdown.Toggle>
                    <Dropdown.Menu bsPrefix="dropdown-menu modal-dropdown-content-background">
                        <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="Admin">Administrator</Dropdown.Item>
                        <Dropdown.Item className="dropdown-item modal-dropdown-content" eventKey="Employee">Pracownik</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer overall-modal">
            <Button variant="secondary button-dismiss" onClick={props.handleClose}>
                Anuluj
            </Button>
            <Button variant="primary button-accept" onClick={props.handleAction}>
                Zapisz zmiany
            </Button>
            </Modal.Footer> 
        </Modal>
        </>
    );   
}

export default DropdownModal;