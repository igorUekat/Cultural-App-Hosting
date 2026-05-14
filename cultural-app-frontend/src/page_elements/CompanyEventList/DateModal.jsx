import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';

function DateModal(props){
    const [showSecondForm, setShowSecondForm] = useState(false);
    const handleShow = (e) => {
        setShowSecondForm(e.target.checked);
    };
    return(
        <>
        <Modal show={props.modalShow} onHide={props.handleClose}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">Zmień datę wydarzenia</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label bsPrefix="modal-label overall-modal-text">W/Od:</Form.Label>
                        <Form.Control
                            type='datetime-local'
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.inputValue}
                            onChange={(e) => {
                                props.handleUserInput(e)
                                props.handleUserInputManyDays(e)
                            }}
                            required
                            type="date"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"  style={{ display: showSecondForm ? 'block' : 'none' }}>
                        <Form.Label bsPrefix="modal-label overall-modal-text">Do:</Form.Label>
                        <Form.Control
                            type='datetime-local'
                            autoFocus
                            bsPrefix="form-control form-light-color"
                            value={props.inputManyDays}
                            required
                            onChange={(e) => props.handleUserInputManyDays(e)}
                            type="date"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 modal-checkbox" controlId="formBasicCheckbox" style={{color: '#9be37d' }}>
                        <Form.Check  type="checkbox" label="Wielodniowe wydarzenie" checked={showSecondForm} onChange={handleShow}/>
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

export default DateModal;