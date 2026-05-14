import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function AddressModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">{props.modalHeading}</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Ulica (np. ul. Kościuszki 19)</Form.Label>
                        <Form.Control
                            type={props.inputTypeStreet}
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.inputValueStreet}
                            onChange={props.handleUserInputStreet}
                            required
                        />
                    </Form.Group>
                </Form>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Miasto</Form.Label>
                        <Form.Control
                            type={props.inputTypeTown}
                            bsPrefix="form-control form-light-color"
                            value={props.inputValueTown}
                            onChange={props.handleUserInputTown}
                            required
                        />
                    </Form.Group>
                </Form>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Kod pocztowy</Form.Label>
                        <Form.Control
                            type={props.inputTypeZipCode}
                            bsPrefix="form-control form-light-color"
                            value={props.inputValueZipCode}
                            onChange={props.handleUserInputZipCode}
                            required
                        />
                    </Form.Group>
                </Form>
                <Alert key='danger' variant='danger' show={props.errorMessage}>
                    {props.errorMessage}
                </Alert>
                {props.loading && <Spinner animation="border" />}
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

export default AddressModal;