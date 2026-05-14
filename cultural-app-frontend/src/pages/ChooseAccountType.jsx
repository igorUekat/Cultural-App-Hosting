import React from 'react';

function ChooseAccountType(){
    return(
        <>
        <header>
            <h1 className="choice_header">Wybierz typ konta</h1>
        </header>
        <main>
            <div className="choice_container">
                <div className="choice_option" aria-label="Użytkownik">
                    <a href="/#/register_account_page">
                    <img src="https://images.pexels.com/photos/35555155/pexels-photo-35555155.jpeg" alt="Ludzie" class="choice_img"/>
                    <div className="choice_text">
                        <h2 className="choice_title">Użytkownik</h2>
                        <p className="choice_description">Zarejestruj się jako użytkownik, aby przeglądać wydarzenia i korzystać z aplikacji.</p>
                    </div>
                    </a>
                </div>
                <div className="choice_option" aria-label="Organizacja">
                    <a href="/#/register_company_account_page">
                    <img src="https://images.pexels.com/photos/2983018/pexels-photo-2983018.jpeg" alt="Druzyna" className="choice_img"/>
                    <div className="choice_text">
                        <h2 className="choice_title">Organizator</h2>
                        <p className="choice_description">Zarejestruj się jako organizator, aby dodawać wydarzenia i zarządzać nimi.</p>
                    </div>
                    </a>
                </div>
            </div>
        </main>
        </>
    );
}

export default ChooseAccountType