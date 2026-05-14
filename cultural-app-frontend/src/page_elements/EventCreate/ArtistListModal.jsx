import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import ArtistCard from '../../components/ArtistCard';
import ArtistCardEventCreate from './ArtistCardEventCreate';
import { PHOTOS, ARTISTS } from '../../constants';
import React from 'react'

/*
<ArtistListModal
    showMainModal=""
    mainModalHide=""
    artistNameValue=""
    handleArtistNameInput=""
    handleArtistPhoto=""
    artistAddErrorMessage=""
    artistAddFileSource=""
    handleArtistAddErrorMessage=""/>
*/
function ArtistListModal(props){
    const photos = JSON.parse(localStorage.getItem(PHOTOS));
    const artists = JSON.parse(localStorage.getItem(ARTISTS));
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState(artists)
    const handleSearch = (e) => {
        setSearch(e.target.value)
        setSearchResult(e.target.value ? artists.filter(item => item.name.includes(e.target.value)) : artists)
    }
    const [showAddArtistModal, setShowAddArtistModal] = useState(false);
    const handleShowAddArtistModal = () => {
        setShowAddArtistModal(true);
    }
    const closeAddArtistModal = () => {
        setShowAddArtistModal(false);
    }
    return(
       <>
        <Modal show={props.showMainModal} fullscreen={true} onHide={props.mainModalHide}>
            <Modal.Header closeButton className="artist-list-modal-header">
                <Modal.Title>Szukaj artystów</Modal.Title>
            </Modal.Header>
            <Modal.Body className="artist-list-modal">
                <div className="justify-content-center" style={{alignItems: 'center'}}>
                    <Form.Control type="text" placeholder="Szukaj..." className="form-light-color" onChange={handleSearch}/>
                    <Button className="hero-button" style={{margin: "1rem"}}>Szukaj</Button>
                </div>
                <div className="event-page-artist-container-scroll" style={{height: '50vh'}}>
                    {searchResult?.map((artist,index) => (
                        <React.Fragment key={`${index}`}>
                            <ArtistCardEventCreate
                                artistId={artist.id}
                                artistName={artist.name}
                                artistPhoto={`${import.meta.env.VITE_API_URL}${photos?.find(item => item.id === artist.photoOfArtist).image}`}
                                artistButtonFunction={props.artistCardButtonFunction}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <Modal.Footer className="artist-list-modal-header">
                    <Button className="event-page-main-button" onClick={handleShowAddArtistModal}>
                        Jeśli nie widzisz artysty którego szukasz, dodaj go!
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
        <Modal show={showAddArtistModal} onHide={closeAddArtistModal}>
            <Modal.Header bsPrefix="modal-header overall-modal">
            <Modal.Title bsPrefix="modal-title overall-modal-text">Stwórz profil artysty</Modal.Title>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body overall-modal">
                <Form>
                    <Form.Label bsPrefix="modal-label overall-modal-text">Nazwa artysty:</Form.Label>
                    <Form.Control
                        type='text'
                        autoFocus
                        bsPrefix="form-control form-light-color"
                        value={props.artistNameValue}
                        onChange={props.handleArtistNameInput}
                        required
                    />
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="modal-label overall-modal-text">Wybierz zdjęcie z galerii</Form.Label>
                        <Form.Control type="file" onChange={props.handleArtistPhoto}/>
                    </Form.Group>
                </Form>
                <Alert key='danger' variant='danger' show={props.artistAddErrorMessage}>
                    {props.artistAddErrorMessage}
                </Alert>
                <img src={props.artistAddFileSource} height="200px" width="200px"/>
            </Modal.Body>
            <Modal.Footer bsPrefix="modal-footer overall-modal">
                <Button variant="secondary button-dismiss" onClick={closeAddArtistModal}>
                    Zamknij
                </Button>
                <Button variant="primary button-accept" onClick={() => {
                    props.handleArtistAddErrorMessage();
                    closeAddArtistModal();
                }}>
                    Dodaj Artystę
                </Button>
            </Modal.Footer> 
        </Modal>
       </> 
    );
}
export default ArtistListModal;