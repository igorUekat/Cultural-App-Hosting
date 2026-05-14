import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function PhotoModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">Zmień zdjęcie firmy</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="modal-label overall-modal-text">Wybierz zdjęcie z galerii</Form.Label>
                        <Form.Control type="file" onChange={props.handlePhotoChange}/>
                    </Form.Group>
                </Form>
                <Alert key='danger' variant='danger' show={props.errorMessage}>
                    {props.errorMessage}
                </Alert>
                {props.loading && <Spinner animation="border" />}
                <img src={props.fileSource} height="200px" width="200px"/>
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
        </>
    );   
}

export default PhotoModal;