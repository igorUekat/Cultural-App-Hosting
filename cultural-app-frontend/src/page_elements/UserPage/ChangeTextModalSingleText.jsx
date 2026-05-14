import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { useState } from 'react';

function ChangeTextModalSingleText(props){
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">{props.modalHeading}</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">{props.modalInstruction}</Form.Label>
                        <Form.Control
                            type={props.inputType}
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.inputValue}
                            onChange={props.handleUserInput}
                            required
                        />
                    </Form.Group>
                </Form>
                <div style={{margin: '10px', display: 'flex', flexDirection: 'column', alignItems: "center", color: "#9be37d"}}>
                    {props.loading && <Spinner animation="border" />}
                </div>
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

export default ChangeTextModalSingleText;