import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import GoogleAuth from '../components/GoogleAuth'

export default function Signup() {
  const [formData,setFormData] = useState({})
  const [loading, setLoading] = useState()
  const [err,setErr] = useState(null)
  const navigate = useNavigate()
  console.log(err);
  

  const hadleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
  }
  const hadleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const {data} = await axios.post('/api/auth/signup',formData)
      if (data.message === "success") {
        setLoading(false)
        navigate('/signin')
        return
      }
      
      setErr(null)
      
    } catch (error) {
      if (error.response.data.message === "Illegal arguments: undefined, string") {
        setErr("Fill in the requirment")
      }else{
        setErr(error.response.data.message)
      }
      setLoading(false)
      
    }
    
  }
  
  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold'>
        Sign Up
      </h1>
      <form onSubmit={hadleSubmit} className=' flex flex-col gap-4'>
          <input
          type='text'
          placeholder='username'
          className=' border rounded-lg p-3 ' 
          id='userName'onChange={hadleChange}/>
          
          <input
          type='text'
          placeholder='email'
          className=' border rounded-lg p-3 ' 
          id='email'onChange={hadleChange}/>
         
          <input
          type='password'
          placeholder='password'
          className=' border rounded-lg p-3 ' 
          id='password'onChange={hadleChange}/>

          <button disabled={loading} className=' bg-slate-700 p-3 text-white hover:opacity-95 disabled:opacity-80 uppercase rounded-lg'>
          {
            loading ? 'Loading...' : '  Sign up'
          }
          </button>
          
          <GoogleAuth/>
      </form>
      <div className=' flex gap-2 mt-5'>
        <p>Have an accout?</p>
        <Link to={'/signin'} className=' text-blue-700'> Sign in </Link>
      </div>
      <div>
      {err && <p className=' text-red-600' >{err}</p>}
      </div>
    </div>
  )
}
