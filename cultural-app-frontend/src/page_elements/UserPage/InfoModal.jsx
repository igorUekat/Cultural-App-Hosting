import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function InfoModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">Przekierowywanie</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <p className="overall-modal-text">Przekierowywanie do Spotify</p>
                <Spinner animation="border" />
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer overall-modal">
                <Button variant="secondary button-dismiss" onClick={props.handleClose}>
                    Zamknij
                </Button>
            </Modal.Footer> 
        </Modal>
        </>
    );   
}

export default InfoModal;