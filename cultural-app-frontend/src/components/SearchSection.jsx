import React from 'react';
import {Container, Row, Col, Dropdown, Form, Button, ButtonGroup, ToggleButton} from 'react-bootstrap';
import {useState} from 'react';
import {USER_LATITUDE, USER_LONGITUDE } from '../constants';
/*
<SearchSection
    distance
    handleDistance
    priceMin
    priceMax
    handlePriceMin
    handlePriceMax
    dateMin
    dateMax
    handleDateMin
    handleDateMax
    search
    handleSearch
    sortCriteria
    sortDirection
    handleSortDirection
    handleSortCriteria
    eventType
    genreContent
    eventGenre
    handleTypeSelection
    handleEventGenre
    searchAction
/>
*/
function SearchSection(props){
    const handleNumbers = (value) => {
        if(value === ""){
            return 0;
        }
        const number = Number(value);
        if (isNaN(number) || number < 0) return 0;
        return number
    }
    return(
        <>
        <div className="search-section">
            <Container style={{borderBottom: '1px solid #9be37d'}}>
                <Row>
                    <Col style={{paddingBottom: '20px'}}>
                        <Form.Label>Odległość (w km)</Form.Label>
                        <Form.Control value={handleNumbers(props.distance)} onChange={props.handleDistance} className="form-light-color" type="number" placeholder="1" min={1} max = {800} step={1} />
                        {localStorage.getItem(USER_LATITUDE) < 0 && localStorage.getItem(USER_LONGITUDE) < 0 && <p style={{color: "red"}}>Upewnij się że masz ustawioną lokację</p>}
                    </Col>
                    <Col style={{paddingBottom: '20px'}}>
                        <Form.Label>Rodzaj wydarzenia</Form.Label>
                        <Dropdown onSelect={props.handleTypeSelection}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                {props.eventType}
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
                        <Form.Label>Gatunek</Form.Label>
                        <Dropdown onSelect={props.handleEventGenre}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="modal-dropdown">
                                {props.eventGenre}
                            </Dropdown.Toggle>
                            {props.genreContent}
                        </Dropdown>
                    </Col>
                    <Col style={{paddingBottom: '20px'}}>
                        <div className="justify-content-center">
                            <Form.Label>Data (od-do)</Form.Label>
                            <Form.Control value={props.dateMin} onChange={props.handleDateMin} className="form-light-color" type="datetime-local" type="date"/>
                            <Form.Control value={props.dateMax} onChange={props.handleDateMax} className="form-light-color" type="datetime-local" type="date"/>
                            {new Date(props.dateMin) > new Date(props.dateMax) && <p style={{color: "red"}}>Górna data nie może być później niż ta poniżej</p>}
                        </div>
                    </Col>
                    <Col style={{paddingBottom: '20px'}}>
                        <div className="justify-content-center">
                            <Form.Label>Cena (od-do)</Form.Label>
                            <Form.Control value={handleNumbers(props.priceMin)} onChange={props.handlePriceMin} className="form-light-color" type="number" placeholder="0" min={0} max = {props.priceMax} step={0.5}/>
                            <Form.Control value={handleNumbers(props.priceMax)} onChange={props.handlePriceMax} className="form-light-color"type="number" placeholder="0" min={props.priceMin} max = {999999} step={0.5}/>
                            {handleNumbers(props.priceMin) > handleNumbers(props.priceMax) && <p style={{color: "red"}}>Górna cena powinna być niższa lub równa dolnej</p>}
                        </div>                   
                    </Col>
                </Row>
            </Container>
            <div className="justify-content-center" style={{margin: '2rem'}}>
                <h2>Sortuj według:</h2>
                <Form.Group>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3"> 
                        <Form.Check
                            inline
                            label="Ceny"
                            name="group1"
                            value="price"
                            type={type}
                            id={`inline-${type}-1`}
                            className="radio"
                            onChange={props.handleSortCriteria}
                        />
                        <Form.Check
                            inline
                            label="Popularności"
                            name="group1"
                            value='popularity'
                            type={type}
                            id={`inline-${type}-2`}
                            className="radio"
                            onChange={props.handleSortCriteria}
                        />
                        <Form.Check
                            inline
                            label="Daty"
                            name="group1"
                            value='date'
                            type={type}
                            className="radio"
                            id={`inline-${type}-3`}
                            onChange={props.handleSortCriteria}
                        />
                        </div>
                    ))}
                </Form.Group>
                <Form.Group>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                        <Form.Check
                            inline
                            label="Rosnąco"
                            name="group2"
                            value='increasing'
                            type={type}
                            id={`inline-${type}-1`}
                            className="radio"
                            onChange={props.handleSortDirection}
                        />
                        <Form.Check
                            inline
                            label="Malejąco"
                            name="group2"
                            value='decreasing'
                            type={type}
                            id={`inline-${type}-2`}
                            className="radio"
                            onChange={props.handleSortDirection}
                        />
                        </div>
                    ))}
                </Form.Group>
            </div>
            <div className="justify-content-center">
                <Form.Control onChange={props.handleSearch} value={props.search} type="text" placeholder="Szukaj..." className="form-light-color"/>
                <Button onClick={props.searchAction} className="hero-button" style={{margin: "1rem"}}>Szukaj</Button>
            </div>
        </div>
        </>
    );
}

export default SearchSection;