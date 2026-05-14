import React from 'react';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';

function ArtistSearchSection(props){
    return(
        <>
        <div className="search-section">
            <Container style={{borderBottom: '1px solid #9be37d'}}>
                    <Row>
                        <Col style={{paddingBottom: '20px'}}>
                            <Form.Label>Rodzaj:</Form.Label>
                            <Dropdown onSelect={props.setTypeSelect}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                    {props.type}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Muzyczne">Muzyczne</Dropdown.Item>
                                    <Dropdown.Item eventKey="Sportowe">Sportowe</Dropdown.Item>
                                    <Dropdown.Item eventKey="Spektakle">Spektakle</Dropdown.Item>
                                    <Dropdown.Item eventKey="Plenerowe">Plenerowe</Dropdown.Item>
                                    <Dropdown.Item eventKey="Muzealne">Muzealne</Dropdown.Item>
                                    <Dropdown.Item eventKey="Konwenty">Konwenty</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col style={{paddingBottom: '20px'}}>
                            <Form.Label>Gatunek:</Form.Label>
                            <Dropdown onSelect={props.setGenreSelect}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                    {props.genre}
                                </Dropdown.Toggle>
                                {props.menuContent}
                            </Dropdown>
                        </Col>
                    </Row>
            </Container>
            <div className="justify-content-center" style={{marginTop: '10px'}}>
                <Form.Control aria-label="szukaj organizacji" type="text" placeholder="Szukaj..." className="form-light-color" value={props.searchText} onChange={props.handleSearch}/>
                <Button className="hero-button" style={{margin: "1rem"}} onClick={props.searchAction}>Szukaj</Button>
            </div>
        </div>
        </>
    );
}

export default ArtistSearchSection;