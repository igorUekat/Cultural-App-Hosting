import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'

function Footer(){
    return(
        <footer>
            <div className="footer-whole-container">
                <img src="/Logo.svg" height="100px" alt="Logo KulturOn"/>
                <Container className='d-flex flex-column gap-4'>
                    <Row>
                        <Container style={{borderBottom: '1px solid #9be37d'}}>
                            <Row>
                                <Col style={{padding: '10px'}}><a href="/#/about_us">O nas</a></Col>
                                <Col style={{padding: '10px'}}><a href="/#/contact">Kontakt</a></Col>
                            </Row>
                            <Row>
                                <Col style={{padding: '10px'}}><a href="/#/terms_of_use">Regulamin dla klientów</a></Col>
                                <Col style={{padding: '10px'}}><a href="/#/terms_of_use_business">Regulamin dla firm</a></Col>
                            </Row>
                        </Container>
                    </Row>
                </Container>
            </div>
            <div className="w-100 foot-footer">
                <span>Igor Skrzyński 2026</span>
            </div>
        </footer>
    );
}

export default Footer;