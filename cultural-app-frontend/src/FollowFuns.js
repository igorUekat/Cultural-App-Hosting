import { CURRENT_USER } from "./constants";
import { isUserLogged } from "./globalFuns";
import api from "./api";

export async function followArtist(artistId){
    const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId}
    const followResponse = await api.post(`/api/follow_artist/${artistId}/`, payload)
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedArtists = [...user.followedArtists, artistId]
        localStorage.setItem(CURRENT_USER, JSON.stringify(user))
    }
}
export async function followCompany(companyId){
    const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId}
    const followResponse = await api.post(`/api/follow_company/${companyId}/`, payload)
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedCompanies = [...user.followedCompanies,companyId]
        localStorage.setItem(CURRENT_USER, JSON.stringify(user))       
    }
}
export async function followEvent(eventId, followersNumber, tags){
    const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId, numberOfFollowers: followersNumber+1}
    const followResponse = await api.post(`/api/follow_event/${eventId}/`, payload)
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedEvents = [...user.followedEvents, eventId]
        const newUserTags = user.tags ? user.tags + tags : tags
        const userPayload = {tags: newUserTags}
        const userResponse = await api.patch(`/api/update_user/`, userPayload)
        if(userResponse.status === 200 || userResponse.status === 201){
            user.tags += newUserTags
            localStorage.setItem(CURRENT_USER, JSON.stringify(user))  
        }
    }
}
export async function unfollowArtist(artistId){
    const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId}
    const followResponse = await api.delete(`/api/unfollow_artist/${artistId}/`, {data: payload})
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedArtists = user.followedArtists.filter(item => item !== artistId)
        localStorage.setItem(CURRENT_USER, JSON.stringify(user))  
    }
}
export async function unfollowCompany(companyId){
    const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId}
    const followResponse = await api.delete(`/api/unfollow_company/${companyId}/`, {data: payload})
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedCompanies = user.followedCompanies.filter(item => item !== companyId)
        localStorage.setItem(CURRENT_USER, JSON.stringify(user))  
    }
}
export async function unfollowEvent(eventId, followersNumber, tags){
const userLogged = await isUserLogged()
    if(!userLogged){
        window.location.href = "/#/login"
        return
    }
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    const userId = user.id
    const payload = {userId: userId, numberOfFollowers: followersNumber-1}
    const followResponse = await api.delete(`/api/unfollow_event/${eventId}/`, {data: payload})
    if(followResponse.status === 200 || followResponse.status === 201){
        user.followedEvents = user.followedEvents.filter(item => item !== eventId)
        const newUserTags = user.tags.replace(tags, "")
        const userPayload = {tags: newUserTags}
        const userResponse = await api.patch(`/api/update_user/`, userPayload)
        if(userResponse.status === 200 || userResponse.status === 201){
            user.tags = newUserTags
            localStorage.setItem(CURRENT_USER, JSON.stringify(user))  
        }
    }
}