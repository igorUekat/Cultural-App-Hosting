import React from 'react';
import NavBar from '../components/NavBar';
import MiniHero from '../components/MiniHero';
import Footer from '../components/Footer';
import LoggedNavBar from "../components/LoggedNavBar";
import { isUserLogged } from "../globalFuns";
import { useState, useEffect } from "react";
import MenuOffcanvas from "../components/MenuOffcanvas";
import LoggedMenuOffcanvas from '../components/LoggedMenuOffcanvas';

function Contact(){
    const [userLogged, setUserLogged] = useState(false);
    useEffect(() => {
        const check = async () => {
            const result = await isUserLogged();
            setUserLogged(result);
        };
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        check();
    }, []);
    const navBar = (truth) =>{
        if(truth){
            return <LoggedNavBar />
        }else{
            return <NavBar/>
        }
    }
    const offcanvas = (truth)=>{
        if(truth){
            return <LoggedMenuOffcanvas/>
        }else{
            return <MenuOffcanvas/>
        }
    }
    return(
    <>
    <header>
        {navBar(userLogged)}
    </header>
    <nav>
        {offcanvas(userLogged)}
    </nav>
    <main>
        <section>
            <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                headingSpecial={true} 
                subheadingDisplayed={true}
                headingText="Kontakt" 
                subheadingText = " "/>
        </section>
        <section>
            <div class="contact-container">
                <p>
                    Masz pytania, sugestie lub chcesz zgłosić wydarzenie? Skontaktuj się z nami!
                </p>
                <div className="event-page-headlines">
                    <h1>
                        Dane kontaktowe
                    </h1>
                </div>
                <ul>
                    <li>Adres e-mail: <a href="mailto:kontakt@kulturon.pl">kontakt@kulturgo.pl</a></li>
                    <li>Telefon: +48 123 456 789</li>
                    <li>Godziny pracy: poniedziałek – piątek, 9:00–17:00</li>
                </ul>
                <div className="event-page-headlines">
                    <h1>
                    Adres korespondencyjny
                    </h1>
                </div>
                <p>
                    KulturGo<br/>
                    ul. Przykładowa 1<br/>
                    00-001 Warszawa<br/>
                    Polska
                </p>
            </div>                   
        </section>
    </main>
    <Footer/>
    </>
    );
}

export default Contact;