import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useDispatch,useSelector} from 'react-redux'
import { userFail, userRequset, userSuccess } from '../slices/userSlice'
import GoogleAuth from '../components/GoogleAuth'

export default function Signin() {
  const [formData,setFormData] = useState({})
  const [err,setErr] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading} = useSelector(state=>state.persistreducer)
  

  const hadleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
  }
  const hadleSubmit = async (e)=>{
    e.preventDefault()
    try {
      dispatch(userRequset())
      const {data} = await axios.post('/api/auth/signin',formData)
      dispatch(userSuccess(data))

      navigate('/')
      setErr(null)
      
    } catch (error) {
      dispatch(userFail(error.response.data.message))
      if (error.response.data.message === "Illegal arguments: undefined, string") {
        setErr("Fill in the requirment")
      }else{
        setErr(error.response.data.message)
      }
      
    }
    
  }
  
  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold'>
        Sign In
      </h1>
      <form onSubmit={hadleSubmit} className=' flex flex-col gap-4'>
         
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
            loading ? 'Loading...' : '  Sign in'
          }
          </button>
          <GoogleAuth/>
      </form>
      <div className=' flex gap-2 mt-5'>
        <p>Dont have an accout?</p>
        <Link to={'/signup'} className=' text-blue-700'> Sign up </Link>
      </div>
      <div>
      {err && <p className=' text-red-600' >{err}</p>}
      </div>
    </div>
  )
}
