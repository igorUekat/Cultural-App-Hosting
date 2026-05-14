import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ArtistCardEventCreate(props) {
  return (
        <Card className="artist-card">
            <div className="artist-card-a">
                <Card.Img className="artist-card-image" variant="top" src={props.artistPhoto} alt="zdjęcie artysty"/>
            </div>
            <Card.Body className="artist-card-body">
                <Card.Text className="artist-card-name">
                    {props.artistName}
                </Card.Text>
                <Button className="event-card-button" variant="primary" onClick={() => props.artistButtonFunction(props.artistName, props.artistPhoto, props.artistId)}>Dodaj</Button>
            </Card.Body>
        </Card>
  );
}

export default ArtistCardEventCreate;