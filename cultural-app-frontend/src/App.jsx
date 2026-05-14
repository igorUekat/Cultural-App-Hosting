import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage';
import EventList from './pages/EventList';
import EventPage from './pages/EventPage';
import ArtistSearch from './pages/ArtistSearch';
import CompanySearch from './pages/CompanySearch';
import ArtistPage from './pages/ArtistPage';
import CompanyPage from './pages/CompanyPage';
import LoginPage from './pages/LoginPage';
import ChooseAccountType from './pages/ChooseAccountType';
import RegisterAccountPage from './pages/RegisterAccountPage';
import RegisterCompanyAccountPage from './pages/RegisterCompanyAccountPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import LoggedPage from './pages/LoggedPage';
import UserPage from './pages/UserPage';
import UserEventList from './pages/UserEventList';
import UserHistoryEventList from './pages/UserHistoryEventList';
import CompanyEventList from './pages/CompanyEventList';
import CompanyHistoryEventList from './pages/CompanyHistoryEventList';
import FollowedArtists from './pages/FollowedArtists';
import FollowedCompanies from './pages/FollowedCompanies';
import NotificationPage from './pages/NotificationPage';
import Contact from './pages/Contact';
import TermsOfUse from './pages/TermsOfUse';
import TermsOfUseBusiness from './pages/TermsOfUseBusiness';
import AboutUs from './pages/AboutUs';
import EventCreate from './pages/EventCreate';
import EmployeesPage from './pages/EmployeesPage';
import AddEmployee from './pages/AddEmployee';
import ProtectedRoute from './components/ProtectedRoute';
import LogOut from './pages/LogOut';
import { useEffect } from 'react'
import { RetrievePhotos, RetrieveArtists, RetrieveCompanies, RetrieveEvents, RetrieveNotifications } from './globalFuns'
import EditEventPage from './pages/EditEventPage';

function App() {
  useEffect(() =>{
    RetrievePhotos()
    RetrieveArtists()
    RetrieveCompanies()
    RetrieveEvents()
    RetrieveNotifications()
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/event_list" element={<EventList/>}/>
        <Route path="/event_page/:id" element={<EventPage/>}/>
        <Route path="/artist_search" element={<ArtistSearch/>}/>
        <Route path="/company_search" element={<CompanySearch/>}/>
        <Route path="/artist_page/:id" element={<ArtistPage/>}/>
        <Route path="/company_page/:id" element={<CompanyPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/choose_account_type" element={<ChooseAccountType/>}/>
        <Route path="/register_account_page" element={<RegisterAccountPage/>}/>
        <Route path="/register_company_account_page" element={<RegisterCompanyAccountPage/>}/>
        <Route path="/register_company_page" element={<RegisterCompanyPage/>}/>
        <Route path="/logged_main_page" element={<ProtectedRoute><LoggedPage/></ProtectedRoute>}/> //protected
        <Route path="/user_page" element={<ProtectedRoute><UserPage/></ProtectedRoute>}/> //protected
        <Route path="/user_event_list" element={<ProtectedRoute><UserEventList/></ProtectedRoute>}/> //protected
        <Route path="/user_history_event_list" element={<ProtectedRoute><UserHistoryEventList/></ProtectedRoute>}/> //protected
        <Route path="/company_event_list" element={<ProtectedRoute><CompanyEventList/></ProtectedRoute>}/> //protected
        <Route path="/company_history_event_list" element={<ProtectedRoute><CompanyHistoryEventList/></ProtectedRoute>}/> //protected
        <Route path="/followed_artists" element={<ProtectedRoute><FollowedArtists/></ProtectedRoute>}/> //protected
        <Route path="/followed_companies" element={<ProtectedRoute><FollowedCompanies/></ProtectedRoute>}/> //protected
        <Route path="/notification_page" element={<ProtectedRoute><NotificationPage/></ProtectedRoute>}/> //protected
        <Route path="/contact" element={<Contact/>}/> 
        <Route path="/terms_of_use" element={<TermsOfUse/>}/>
        <Route path="/terms_of_use_business" element={<TermsOfUseBusiness/>}/>
        <Route path="/about_us" element={<AboutUs/>}/>
        <Route path="/event_create" element={<ProtectedRoute><EventCreate/></ProtectedRoute>}/> //protected
        <Route path="/employees_page" element={<ProtectedRoute><EmployeesPage/></ProtectedRoute>}/> //protected
        <Route path="/add_employee" element={<ProtectedRoute><AddEmployee/></ProtectedRoute>}/> //protected
        <Route path="/logout" element={<ProtectedRoute><LogOut/></ProtectedRoute>}/>
        <Route path="/edit_event/:id" element={<ProtectedRoute><EditEventPage/></ProtectedRoute>}/>
      </Routes>
    </Router>
  )
}

export default App


