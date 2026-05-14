import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function ConfirmationModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">{props.notificationText}</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <p className="overall-modal-text">{props.info}</p>
                {props.loading && <Spinner animation="border" />}
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer overall-modal">
                <Button variant="secondary button-dismiss" onClick={props.handleClose}>
                    Nie
                </Button>
                <Button variant="secondary button-accept" onClick={props.handleAction}>
                    Tak
                </Button>
            </Modal.Footer> 
        </Modal>
        </>
    );   
}

export default ConfirmationModal;