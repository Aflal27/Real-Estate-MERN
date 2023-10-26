import React from 'react'
import {signInWithPopup} from 'firebase/auth'
import {auth,provider} from '../firebase'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import { userSuccess } from '../slices/userSlice'
import { useNavigate } from 'react-router-dom'

export default function GoogleAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogle = async()=>{
        try {
            const res = await signInWithPopup(auth,provider)
          const {data} =  await axios.post('http://localhost:8000/api/auth/google',{
                name:res.user.displayName,
                email:res.user.email,
                photo:res.user.photoURL
            })
            dispatch(userSuccess(data))
            navigate('/')
            console.log(data);
            console.log(res);
        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }
  return (
    <button type='button' onClick={handleGoogle}
     className=' bg-red-700 p-3 rounded-lg uppercase text-white hover:opacity-95 text-center'>
        continue with google
     </button>
  )
}
