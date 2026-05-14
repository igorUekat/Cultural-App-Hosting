import React from "react";
import "../style.css";
import { Container, Row, Col, Button } from 'react-bootstrap';

//<Hero heroImage, headingSpecial, subheadingDisplayed, buttonDisplayed, headingText, sunheadText, buttonText/>
function MiniHero(props){
    const heroImage = {backgroundImage: `url(${props.heroImage})`};
    const isHeadingSpecial = props.headingSpecial ? 'mb-3 special-hero-heading' : 'mb-3';
    const isSubheadingDisplayed = props.subheadingDisplayed ? 'mb-3' : 'd-none';
    return(
        <>
            <div
                className='text-center bg-image mini-hero'
                style={heroImage}
                alt={props.imageAlt}
            >
                <div className='mini-hero-overlay'>
                    <div className='mini-hero-text-container'>
                        <h1 className={isHeadingSpecial}>{props.headingText}</h1>
                        <h2 className={isSubheadingDisplayed}>{props.subheadingText}</h2>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MiniHero;