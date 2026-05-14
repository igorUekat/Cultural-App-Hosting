import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LoggedNavBar from "../components/LoggedNavBar";
import MenuOffcanvas from "../components/MenuOffcanvas";
import { isUserLogged } from "../globalFuns";
import { useState, useEffect } from "react";
import LoggedMenuOffcanvas from "../components/LoggedMenuOffcanvas";

function AboutUs(){
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
                <Hero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
                    headingSpecial={true} 
                    subheadingDisplayed={false}
                    textBackground={false} 
                    buttonDisplayed={false} 
                    headingText="O nas" 
                    subheadingText = "" 
                    buttonText = ""/>
            </section>
            <section>
                <div style={{display: 'flex', flexWrap:"wrap", justifyContent:"center"}}>
                        <div className="event-page-headlines" style={{width: '65%'}}>
                            <h1>
                                Czym jest KultuGo?
                            </h1>
                        </div>
                        <div className="horizontal-block-display">
                            <img src="https://images.pexels.com/photos/1486628/pexels-photo-1486628.jpeg" alt="Zdjęcie przedstawiające confetti na tle tańczących ludzi"/>
                            <div className="block-text">
                                <p>
                                    KulturGo to aplikacja webowa pozwalająca każdemu użytkownikowi na śledzenie wydarzeń kulturalnych odbywających się w całej Polsce. przedsiębiorstwom zaś pozwala na promowanie tutaj swoich wydarzeń.
                                </p>
                            </div>
                        </div>
                        <div className="event-page-headlines" style={{width: '65%'}}>
                            <h1>
                                Misja
                            </h1>
                        </div>
                        <div className="horizontal-block-display">
                            <div className="block-text">
                                <p>
                                    Naszym zadaniem jest promocja jak najszerszego rodzaju wydarzeń kulturalnych jak najszerszemu gronu odbiorców w celu zwiększenia udziału Polaków w kulturze
                                </p>
                            </div>
                            <img src="https://images.pexels.com/photos/8448582/pexels-photo-8448582.jpeg" alt="zdjęcie przedstawiające "/>
                        </div>
                </div>
            </section>
        </main>
        <Footer/>   
    </>
    );
}

export default AboutUs;