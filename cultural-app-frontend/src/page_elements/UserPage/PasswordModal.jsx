import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function PasswordModal(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">Zmień hasło</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Podaj stare hasło</Form.Label>
                        <Form.Control
                            type='password'
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.oldPasswordValue}
                            onChange={props.handleOldPassword}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Podaj nowe hasło</Form.Label>
                        <Form.Control
                            type='password'
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.newPasswordValue}
                            onChange={props.handleNewPassword}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">Powtórz nowe hasło</Form.Label>
                        <Form.Control
                            type='password'
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.newPasswordRepeatValue}
                            onChange={props.handleNewPasswordRepeat}
                            required
                        />
                    </Form.Group>
                </Form>
                <Alert key='danger' variant='danger' show={props.errorMessage}>
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
        </>
    );   
}

export default PasswordModal;