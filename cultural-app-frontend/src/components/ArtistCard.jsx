import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { followArtist, followCompany, unfollowArtist, unfollowCompany } from '../FollowFuns';

function ArtistCard(props) {
    const isArtist = props.isArtist
    const itemId = props.artistId
    const rawUser = localStorage.getItem(CURRENT_USER)
    const user = rawUser ? JSON.parse(rawUser) : null
    const [isFollowed, setIsFollowed] = useState(isArtist ? (user?.followedArtists?.includes(props.artistId) ?? false) : (user?.followedCompanies?.includes(props.artistId) ?? false))
    const handleFollowing = async () => {
        if(!isFollowed){
            try{
                if(isArtist){
                    await followArtist(itemId)
                }
                else{
                    await followCompany(itemId)
                }
                setIsFollowed(true)  
            }catch(err){
                console.log("Coś poszło nie tak" + err)
            }
        }else{
                if(isArtist){
                    await unfollowArtist(itemId)
                }
                else{
                    await unfollowCompany(itemId)
                }
                setIsFollowed(false) 
        }
    }
    return (
        <Card className="artist-card">
            <a href={props.artistPage} className="artist-card-a">
                <Card.Img className="artist-card-image" variant="top" src={props.artistPhoto} alt={`Strona artysty`}/>
            </a>
            <Card.Body className="artist-card-body">
                <Card.Text className="artist-card-name">
                    {props.artistName}
                </Card.Text>
                <Button className={isFollowed ? "event-card-button-clicked" : "event-card-button"} variant="primary" onClick={handleFollowing}>{isFollowed ? "Obserwujesz" : "Obserwuj"}</Button>
            </Card.Body>
        </Card>
    );
}

export default ArtistCard;