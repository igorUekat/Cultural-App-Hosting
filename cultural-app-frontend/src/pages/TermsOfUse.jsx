import React from 'react';
import NavBar from '../components/NavBar';
import MiniHero from '../components/MiniHero';
import Footer from '../components/Footer';
import LoggedNavBar from "../components/LoggedNavBar";
import MenuOffcanvas from "../components/MenuOffcanvas";
import { isUserLogged } from "../globalFuns";
import { useState, useEffect } from "react";
import LoggedMenuOffcanvas from "../components/LoggedMenuOffcanvas"

function TermsOfUse(){
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
        <MiniHero heroImage="https://images.pexels.com/photos/19130866/pexels-photo-19130866.jpeg" 
            headingSpecial={true} 
            subheadingDisplayed={true}
            headingText="Regulamin dla użytkowników" 
            subheadingText = " "/>
    </main>
    <div class="contact-container">
        <section>
            <h2>§1. Postanowienia ogólne</h2>
            <ul>
                <li>Regulamin określa zasady korzystania ze strony KulturGo.</li>
                <li>Właścicielem serwisu jest Igor Skrzyński.</li>
                <li>Korzystając z serwisu, akceptujesz ten regulamin.</li>
            </ul>

            <h2>§2. Zakres usług</h2>
            <ul>
                <li>Serwis umożliwia przeglądanie wydarzeń kulturalnych.</li>
                <li>Nie prowadzimy sprzedaży biletów – odsyłamy do zewnętrznych źródeł.</li>
            </ul>

            <h2>§3. Rejestracja i konto użytkownika</h2>
            <ul>
                <li>Rejestracja jest dobrowolna i darmowa.</li>
                <li>Użytkownik odpowiada za prawdziwość danych i bezpieczeństwo konta.</li>
            </ul>

            <h2>§4. Odpowiedzialność</h2>
            <ul>
                <li>Dokładamy starań, by dane były aktualne, ale nie ponosimy odpowiedzialności za ich zmiany.</li>
                <li>Nie odpowiadamy za działania organizatorów wydarzeń.</li>
            </ul>
            <h2>§5. Dane osobowe i prywatność</h2>
            <ul>
                <li>Dane użytkowników są przetwarzane zgodnie z RODO.</li>
                <li>Więcej informacji znajdziesz w naszej Polityce Prywatności.</li>
            </ul>
            <h2>§6. Postanowienia końcowe</h2>
            <ul>
                <li>Administrator zastrzega prawo do zmian w regulaminie.</li>
                <li>W sprawach spornych obowiązuje prawo polskie.</li>
            </ul>
        </section>
        <section>
            <p>
                Kontakt: <a href="mailto:kontakt@kulturgo.pl">kontakt@kulturgo.pl</a>
            </p>
        </section>
    </div>
    <Footer/>
    </>
    );
}

export default TermsOfUse;