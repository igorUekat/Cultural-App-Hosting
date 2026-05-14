import React from 'react';
import NavBar from '../components/NavBar';
import MiniHero from '../components/MiniHero';
import Footer from '../components/Footer';
import LoggedNavBar from "../components/LoggedNavBar";
import { isUserLogged } from "../globalFuns";
import { useState, useEffect } from "react";
import MenuOffcanvas from "../components/MenuOffcanvas";
import LoggedMenuOffcanvas from "../components/LoggedMenuOffcanvas"
function TermsOfUseBusiness(){
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
        headingText="Regulamin dla firm" 
        subheadingText = " "/>
    <div class="contact-container">
        <section>
            <h2>§1. Postanowienia ogólne</h2>
            <ul>
                <li>Niniejszy regulamin określa zasady współpracy między platformą KulturGo a przedsiębiorstwami publikującymi wydarzenia kulturalne.</li>
                <li>Właścicielem serwisu KulturGo jest Igor Skrzyński.</li>
                <li>Korzystanie z usług publikacyjnych oznacza akceptację niniejszego regulaminu.</li>
            </ul>

            <h2>§2. Zakres usług</h2>
            <ul>
                <li>KulturGo umożliwia przedsiębiorstwom dodawanie, edytowanie i promowanie wydarzeń kulturalnych.</li>
                <li>Platforma zastrzega sobie prawo do moderowania treści.</li>
            </ul>

            <h2>§3. Rejestracja i konto firmowe</h2>
            <ul>
                <li>Do korzystania z usług wymagane jest założenie konta firmowego.</li>
                <li>Firma zobowiązana jest do podania prawdziwych danych oraz do ich aktualizacji.</li>
                <li>Administrator może weryfikować dane firmowe przed aktywacją konta.</li>
            </ul>

            <h2>§4. Obowiązki przedsiębiorstwa</h2>
            <ul>
                <li>Publikowane wydarzenia muszą być zgodne z polskim prawem i tematyką kulturalną.</li>
                <li>Zakazane jest publikowanie treści reklamowych niezwiązanych z wydarzeniami kulturalnymi.</li>
                <li>Firma odpowiada za rzetelność i aktualność podawanych informacji.</li>
            </ul>

            <h2>§5. Odpowiedzialność</h2>
            <ul>
                <li>KulturGo nie ponosi odpowiedzialności za ewentualne szkody wynikające z błędnych informacji przekazanych przez firmę.</li>
                <li>Administrator zastrzega sobie prawo do usunięcia wydarzenia lub zablokowania konta w przypadku naruszenia regulaminu.</li>
            </ul>

            <h2>§6. Dane osobowe i polityka prywatności</h2>
            <ul>
                <li>Dane osobowe przedstawicieli firm są przetwarzane zgodnie z obowiązującymi przepisami prawa (RODO).</li>
                <li>Szczegóły dostępne są w Polityce Prywatności serwisu.</li>
            </ul>

            <h2>§7. Postanowienia końcowe</h2>
            <ul>
                <li>KulturGo zastrzega sobie prawo do zmian regulaminu.</li>
                <li>Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby administratora serwisu.</li>
            </ul>
        </section>
        <section>
            <p>
                Kontakt dla firm: <a href="mailto:partnerzy@kulturgo.pl">partnerzy@kulturgo.pl</a>
            </p>
        </section>
    </div>
    </main>
    <Footer/>
    </>
    );
}

export default TermsOfUseBusiness;