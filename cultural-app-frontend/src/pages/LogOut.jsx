import {Navigate} from 'react-router-dom'
import React, { useEffect } from 'react'
import { RetrievePhotos, ClearData } from '../globalFuns'
import api from '../api'

function LogOut(){
    useEffect(() =>{
        const action = async() =>{
            try{
                const response = await api.post('/api/logout_user/')
            }catch(err){
                console.log(err)
            }
        }
        action()
        ClearData()
    }, [])
    return <Navigate to="/login"/>
}

export default LogOut;