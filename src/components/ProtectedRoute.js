import React from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import {  useSelector } from 'react-redux'

export default function ProtectedRoute() {
    const {user} = useSelector(state=>state.persistreducer)
  return user.userData?.email ? <Outlet/> : <Navigate to={'/signin'} />
}
