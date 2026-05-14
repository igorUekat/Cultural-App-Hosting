import React from "react";
import "../style.css";
import { Container, Row, Col, Button } from 'react-bootstrap';

//<Hero heroImage, headingSpecial, subheadingDisplayed, buttonDisplayed, headingText, sunheadText, buttonText/>
function Hero(props){
    const heroImage = {backgroundImage: `url(${props.heroImage})`};
    const isHeadingSpecial = props.headingSpecial ? 'mb-3 special-hero-heading' : 'mb-3';
    const isSubheadingDisplayed = props.subheadingDisplayed ? 'mb-3' : 'd-none';
    const isButtonDisplayed = props.buttonDisplayed ? 'btn btn-lg hero-button' : 'd-none';
    const textBackground = props.textBackground ? 'hero-text-background' : '';
    return(
        <>
            <div
                className='p-5 text-center bg-image hero'
                style={heroImage}
                alt={props.imageAlt}
            >
                <div className='hero-overlay'>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className={textBackground}>
                            <h1 className={isHeadingSpecial}>{props.headingText}</h1>
                            <h2 className={isSubheadingDisplayed}>{props.subheadingText}</h2>
                            <a className={isButtonDisplayed} href={props.buttonLink} role='button'>
                                {props.buttonText}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;