import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import EventSlider from '../components/EventSlider';
import {RetrievePhotos, isUserLogged} from "../globalFuns";
import {EVENTS} from "../constants";
import {useEffect, useState} from "react"
import { Navigate } from "react-router-dom";
import MenuOffcanvas from "../components/MenuOffcanvas";


function MainPage(){   
    const [userLogged, setUserLogged] = useState(false)
    useEffect(() =>{
        const check = async () =>{
            const result = await isUserLogged();
            setUserLogged(result);
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        check();
    }, [])
    if(userLogged){
        return <Navigate to="/logged_main_page"/>
    }
    return(
        <>
        <header>
            <NavBar/>
        </header>
        <nav>
            <MenuOffcanvas/>
        </nav>
        <main>
            <section>
                <Hero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={true} 
                    subheadingDisplayed={false}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText="Zacznij śledzić kulturę" 
                    subheadingText = "" 
                    buttonText = ""/> 
            </section>          
            <section>
                <Hero heroImage="https://images.pexels.com/photos/13963614/pexels-photo-13963614.jpeg" 
                  headingSpecial={false} 
                  subheadingDisplayed={true}
                  textBackground={true} 
                  buttonDisplayed={false} 
                  headingText="Scentralizowana lista wydarzeń w Polsce" 
                  subheadingText = "Przeglądaj i śledź wydarzenia tworzone przez wielu organizatorów w jednym miejscu" 
                  buttonText = ""/>
            </section>
            <section>
                <Hero heroImage="https://images.pexels.com/photos/218686/pexels-photo-218686.jpeg" 
                    headingSpecial={false} 
                    subheadingDisplayed={false}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText="Zintegruj swoje konto spotify, aby dowiadywać się o przybyciu twoich ulubionych twórców do Polski!" 
                    subheadingText = "" 
                    buttonText = ""/>
            </section>
            <section>
                <Hero heroImage="https://images.pexels.com/photos/15362149/pexels-photo-15362149.jpeg" 
                  headingSpecial={true} 
                  subheadingDisplayed={false}
                  textBackground={false} 
                  buttonDisplayed={true} 
                  headingText="Weź udział w Kulturze!" 
                  subheadingText = "" 
                  buttonText = "Dołącz teraz!"
                  buttonLink="/#/register_account_page"/>  
            </section>                   
        </main>
        <footer>
            <Footer/>
        </footer>
        </>
    );
}

export default MainPage;