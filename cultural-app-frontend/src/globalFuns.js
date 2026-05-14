import api from "./api";
import { PHOTOS, ACCESS_TOKEN, REFRESH_TOKEN, ARTISTS, EVENTS, COMPANIES, NOTIFICATIONS, CURRENT_USER, USERS_COMPANY } from "./constants";
import {jwtDecode} from "jwt-decode";
export async function RetrievePhotos(){
    const populateResponse = await api.get("/api/get_photos/")
    if(populateResponse.status === 200 || populateResponse.status === 201){
        localStorage.setItem(PHOTOS, JSON.stringify(populateResponse.data))
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    }
}
export async function RetrieveArtists(){
    const populateResponse = await api.get("/api/get_artists/")
    if(populateResponse.status === 200 || populateResponse.status === 201){
        localStorage.setItem(ARTISTS, JSON.stringify(populateResponse.data))
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    }
}
export async function RetrieveEvents(){
    const populateResponse = await api.get("/api/get_events/")
    if(populateResponse.status === 200 || populateResponse.status === 201){
        localStorage.setItem(EVENTS, JSON.stringify(populateResponse.data))
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    }
}
export async function RetrieveCompanies(){
    const populateResponse = await api.get("/api/get_companies/")
    if(populateResponse.status === 200 || populateResponse.status === 201){
        localStorage.setItem(COMPANIES, JSON.stringify(populateResponse.data))
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    }   
}
export async function RetrieveNotifications(){
    const populateResponse = await api.get("/api/get_notifications/")
    if(populateResponse.status === 200 || populateResponse.status === 201){
        localStorage.setItem(NOTIFICATIONS, JSON.stringify(populateResponse.data))
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    }   
}
export async function RetrieveEventArtists(id){
    const populateResponse = await api.get(`/api/get_event_artists/${id}/`)
    if(populateResponse.status === 200 || populateResponse.status === 201){
        return JSON.stringify(populateResponse.data)
    }else{
        console.log(populateResponse.data?.error || "Nieznany błąd")
    } 
}
export async function ClearData(){
    localStorage.removeItem(CURRENT_USER)
    localStorage.removeItem(USERS_COMPANY)
    await RetrievePhotos()
    await RetrieveArtists()
    await RetrieveCompanies()
    await RetrieveNotifications()
    await RetrieveEvents()
}
export async function RetrieveLocation(town, voivod) {
    try {
        const response = await api.get("/api/get_coordinates", {
            params: { town, voivod },
        });
        return response.data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - location service is taking too long');
        }
        throw error;
    }
}
export async function isUserLogged(){
    try {
        const res = await api.get("/api/verify/")
        console.log(res.data.isAccessValid)
        if(res.data.isAccessValid){
            return true
        } else {
            if(!res.data.isRefreshValid){
                return false
            }
            try {
                await api.post("/api/token/refresh/", {})
                return true
            } catch {
                return false
            }
        }
    } catch {
        return false
    }
}
export function getDistance(lat1, lon1, lat2, lon2) {
    const radius = 6371
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
}
export function getEventsByTags(tags, eventId = 0){
    const splitTags = tags?.split(";")
    const now = new Date()
    const events = JSON.parse(localStorage.getItem(EVENTS)).filter(item => new Date(item.secondDate) >= now)
    const filteredEvents = events.filter(item => splitTags.some(tag => item.tags.includes(tags)))
    if(eventId !== 0){
        return filteredEvents.filter(item => item.id !== eventId)
    }
    return filteredEvents
}
export async function getUserNotifications(user){
    let date;
    if(!user.lastTimeNotifOpened){
        const payload = {lastTimeNotifOpened: new Date().toISOString()}
        const response = await api.patch(`/api/update_user/`, payload)
        if(response === 200 || response === 201){
            date = new Date()
            user.lastTimeNotifOpened = String(date)
            localStorage.setItem(CURRENT_USER, JSON.stringify(user))
        }
    }else{
        date = new Date(user.lastTimeNotifOpened)
    }
    const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS)) || []
    const userNotifications = allNotifications.filter(item => (user.followedEvents.includes(item.event) || user.followedArtists.includes(item.artist) || user.followedCompanies.includes(item.company)) && new Date(item.created) >= date)
    return userNotifications
}
export async function manageSpotifyArtists(spotifyResponse, user){
    const artists = JSON.parse(localStorage.getItem(ARTISTS))
    for(const artist of spotifyResponse.items){
        const existingArtist = artists?.find(item => item.spotifyId === artist.id)
        let artistId;
        if (existingArtist){
            if(user.followedArtists?.includes(existingArtist.id)){
                continue
            }else{
                artistId = existingArtist.id
            }
        }else{
            const artistPayload = {name: artist.name, photoUrl: artist.images[0].url, spotifyId: artist.id}
            const artistResponse = await api.post(`/api/create_spotify_artist/`, artistPayload)
            if(artistResponse.status === 200 || artistResponse.status === 201){
                artistId = artistResponse.data.id
            }
        }
        const followPayload = {userId : user.id}
        const followResponse = await api.post(`/api/follow_artist/${artistId}/`, followPayload)
        if(followResponse.status === 200 || followResponse.status === 201){
            user.followedArtists = [...user.followedArtists, artistId]
            localStorage.setItem(CURRENT_USER, JSON.stringify(user))
        }
    }
    window.location.href = "/#/followed_artists"
}
