import React from "react";
import {Card, Button} from "react-bootstrap";
import { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { followEvent, unfollowEvent } from '../FollowFuns';

function EventCard(props){
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
    return(
        <Card className="align-items-center event-card">
            <a href={props.eventLink} style={{textDecoration: 'none'}} className="event-card-a">
                <Card.Img
                    className="event-card-image" 
                    variant="top" 
                    src={props.eventImage}
                    alt={`strona artysty ${props.eventTitle}`}
                />
            </a>
            <Card.Body className="event-card-body">
                <Card.Title className="event-card-title">{props.eventTitle}</Card.Title>
                <Card.Text className="event-card-text">
                    <p>{props.eventDate}</p>
                    <p>{props.eventPlace}</p>
                    <p>{props.eventPrice}</p>
                </Card.Text>
                <Button variant="primary" className={isFollowed? "event-card-button-clicked" :"event-card-button"} onClick={handleFollowing}>{isFollowed ? "Śledzisz" : "Śledź"}</Button>
            </Card.Body>
        </Card>
    );
}

/*
<EventCard 
    eventImage="" 
    eventDate="" 
    eventPlace="" 
    eventPrice="" 
    eventLink=""
/>
*/

export default EventCard;