import {Navigate} from "react-router-dom"
import api from "../api"
import {useState, useEffect} from 'react'


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await api.get("/api/verify/")
            console.log(res.data.isAccessValid)
            if(res.data.isAccessValid){
                setIsAuthorized(true)
            } else {
                console.log(res.data.isRefreshValid)
                if(!res.data.isRefreshValid){
                    setIsAuthorized(false)
                    return
                }
                try {
                    await api.post("/api/token/refresh/", {})
                    setIsAuthorized(true)
                } catch {
                    setIsAuthorized(false)
                }
            }
        } catch {
            setIsAuthorized(false)
        }
    }
    if (isAuthorized === null) {
        return <div>Trwa ładowanie...</div>
    }
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute