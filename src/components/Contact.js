import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({listing}) {
    const [landLord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')
    useEffect(()=>{
        try {
            const fatch = async()=>{
                const {data} = await axios.get(`/api/user/${listing.userRef}`)
                setLandLord(data)
             }
             fatch()
        } catch (error) {
            console.log(error);
        }
    },[])
  return (
    <>
      {
        landLord && (
            <div className=' flex flex-col gap-4'>
                <p>
                    Contact <span className=' font-semibold'>{landLord.userName}</span>{' '}
                     for{' '}<span className=' font-semibold'>{listing.name.toLowerCase()}</span>
                </p>
                <textarea
                name='message'
                id='message'
                rows='2'
                placeholder='Enter your message here...'
                className=' w-full border p-3 rounded-lg'
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                >
                </textarea>

                <Link
                className=' bg-slate-700 text-white p-3 rounded-lg text-center'
                 to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                    send message
                </Link>
            </div>
        )
      }
    </>
  )
}
