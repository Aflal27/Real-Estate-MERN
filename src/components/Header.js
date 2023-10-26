import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link ,useNavigate} from 'react-router-dom'

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const {user} = useSelector(state=>state.persistreducer)
    const nav =[
        {name:"Home",link:'/'},
        {name:"About",link:'/about'},
        
    ]

    const handleSubmit = (e)=>{
        e.preventDefault()
        const urlParam = new URLSearchParams(window.location.search) 
        urlParam.set('searchTerm',searchTerm)
        const searchQuery = urlParam.toString()
        navigate(`/search?${searchQuery}`)
        
    }

    useEffect(()=>{
        const urlParam = new URLSearchParams(location.search)
        const searchTermFormUrl = urlParam.get('searchTerm')
        if (searchTermFormUrl) {
            setSearchTerm(searchTermFormUrl)
        }
    },[location.search])
  return (
    <header className=' bg-slate-200 shadow-md'>
        <div className=' flex items-center justify-between max-w-6xl mx-auto p-3'>
            <Link to={'/'}>
                <h1 className=' font-bold flex flex-wrap text-sm sm:text-xl'>
                    <span className=' text-slate-500'>AFLAL</span>
                    <span className=' text-slate-700'>Estate</span>
               </h1>
            </Link>
            
            <form onSubmit={handleSubmit} className=' bg-slate-100 rounded-lg p-3 flex items-center'>
                <input
                type='text'
                onChange={(e)=>setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder='Search...'
                className=' bg-transparent outline-none w-24 sm:w-64'/>
                <button>
                    <FaSearch
                    className=' text-slate-600'/>
                </button>
            </form>
            <ul className=' flex gap-4 items-center'>
                {nav.map((item,i)=>(
                    <li className=' hidden sm:inline hover:underline text-slate-700'>
                    <Link to={item.link} key={i} > {item.name} </Link>
                    </li>
                ))}
                <Link  to={'/profile'}>
                    {user.userData?.avatart ? (
                         <img
                          src={user.userData.avatart} 
                          alt='profile'
                          className=' w-10 h-10 rounded-full'/>
                    ):
                    ( <li className='hover:underline text-slate-700'>
                    Sign in
                </li>)}
                   
                </Link>
                
            </ul>
        </div>
    </header>
  )
}
