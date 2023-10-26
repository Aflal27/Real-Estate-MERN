import React from 'react'
import {BrowserRouter , Route , Routes} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './pages/UserProfile'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/search' element={<Search/>}/>

            <Route element={<ProtectedRoute/>}>
              <Route path='/profile' element={<UserProfile/>} />
              <Route path='/cratelisting' element={<CreateListing/>}/>
              <Route path='/updatelisting/:id' element={<UpdateListing/>}/>
              <Route path='/listing/:listingId' element={<Listing/>}/>
            </Route>

            <Route path='/signin' element={<SignIn/>} />
            <Route path='/signup' element={<Signup/>} />

        </Routes>
    </BrowserRouter>
  )
}
