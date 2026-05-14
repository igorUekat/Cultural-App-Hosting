import React from 'react';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';

function NotificationHolder(props) {
  return (
    <article>
        <a href={props.eventLink} style={{textDecoration:"none"}}>
        <Card className="event-holder" style={{ width: '60rem', height: '20rem'}}>
                <Row style={{height: '100%'}}>
                    <Col md={4} style={{height: "100%"}}>
                        <Card.Img 
                            src={props.eventImage} 
                            className="img-fluid rounded-start event-holder-image"
                            alt="Zdjęcie promujące wydarzenie"
                        />
                    </Col>
                    <Col style={{maxHeight: '25rem'}}>
                        <Card.Body className="event-holder-body">
                            <Card.Title className="event-holder-title">{props.eventName}</Card.Title>
                            <Card.Text className="event-holder-info">
                                {props.eventDate}, {props.eventPlace}
                            </Card.Text>
                            <Card.Text className="event-holder-info">
                                {props.eventPrice}
                            </Card.Text>
                            <img src="/heart-lime.svg" alt="liczba śledzących" height="50rem"/>
                            <Card.Text className="event-holder-info">
                                {props.eventPopularity}
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
        </Card>
        </a>
    </article>
  );
}

export default NotificationHolder;