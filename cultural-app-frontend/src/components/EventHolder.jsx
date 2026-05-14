import React from 'react';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { followEvent, unfollowEvent } from '../FollowFuns';

function HorizontalCard(props) {
    const itemId = props.eventId
    const [eventFollowers, setEventFollowers] = useState(props.numberOfFollowers)
    const tags = props.eventTags
    const rawUser = localStorage.getItem(CURRENT_USER)
    const user = rawUser ? JSON.parse(rawUser) : null
    const [isFollowed, setIsFollowed] = useState(user?.followedEvents?.includes(props.eventId) ?? false)
    const handleFollowing = async () => {
        if(!isFollowed){
            try{
                await followEvent(itemId, eventFollowers, tags)
                setEventFollowers(eventFollowers+1)
                setIsFollowed(true)  
            }catch(err){
                console.log("Coś poszło nie tak" + err)
            }
        }else{
            await unfollowEvent(itemId, eventFollowers, tags)
            setEventFollowers(eventFollowers-1)
            setIsFollowed(false) 
        }
    }
    return (
    <article>
        <Card className="event-holder" style={{ width: '60rem', height: '25rem'}}>
            <Row style={{height: '100%'}}>
                <Col md={4} style={{height:"100%"}}>
                    <a href={props.eventLink} style={{textDecoration:"none", height:"100%"}}>
                        <Card.Img 
                            src={props.eventImage} 
                            className="img-fluid rounded-start event-holder-image"
                            alt="Strona wydarzenia"
                        />
                    </a>
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
                        <Card.Text className="event-holder-text">
                            {props.eventDescription}
                        </Card.Text>
                        <img src="/heart-lime.svg" alt="liczba śledzących" height="50rem"/>
                        <Card.Text className="event-holder-info">
                            {props.eventPopularity}
                        </Card.Text>
                    <Button variant="primary" className={isFollowed? "event-card-button-clicked" :"event-card-button"} onClick={handleFollowing}>{isFollowed ? "Śledzisz" : "Śledź"}</Button>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    </article>
  );
}

export default HorizontalCard;