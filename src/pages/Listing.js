import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaParking } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'


export default function Listing() {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const params = useParams()
  const {user} = useSelector(state=>state.persistreducer)
  const [contect, setContect] = useState(false)
  
  useEffect(()=>{
    const fatch = async()=>{
      try {
        setLoading(true)
        const {data} = await axios.get(`/api/listing/get/${params.listingId}`)
        setListing(data)
        setLoading(false)
        setError(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fatch()
  },[params.listingId])
  return (
    <main>
      {
        loading && <p className=' text-center text-2xl my-7' >Loading...</p>
      }
      {
        error && <p className=' text-center text-2xl my-7'>Something went wrong!</p>
      }
      
      {
        listing && !loading && !error && (
          <>
             <div>
            <Swiper navigation>
                {
                  listing.imageUrls.map((url)=>(
                      <SwiperSlide key={url}>
                          <div className=' h-[550px]'
                          style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}>
                          </div>
                      </SwiperSlide>
                  ))
                }
            </Swiper>
          </div>

          <div className=' flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className=' text-2xl font-semibold'>
              {listing.name} -${' '}
              {listing.offer 
              ? listing.discountPrice
              :listing.regulerPrice}
              {listing.type === 'rent' && '/ month'}
            </p>
            <p className=' flex gap-4'>
              <FaMapMarkedAlt className=' text-green-700'/>
              {listing.address}
            </p>
            <div className=' flex gap-4'>
              <p className=' bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {
                  listing.type === 'rent' ? 'For Rent' : 'For Sale'
                }
              </p>
              {
                  listing.offer && (
                    <p  className=' bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                      ${+listing.regulerPrice- +listing.discountPrice} OFF
                    </p>
                  )
                }
            </div>
            <p className=' text-slate-800'>
              <span className=' font-semibold text-black'>
                Description -
              </span>
              {listing.description}
            </p>
            <ul className=' text-green-700 font-semibold text-sm flex gap-4 items-center sm:gap-6 flex-wrap'>
              <li className=' flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg'/>
                {listing.bedroom > 1 ? `${listing.bedroom} Beds` 
                : `${listing.bedroom} Bed`}
              </li>
              <li className=' flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-lg'/>
                {listing.bathroom > 1 ? `${listing.bedroom} Baths` 
                : `${listing.bedroom} Bath`}
              </li>
              <li className=' flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking Sport' : 'No Parking'}
              </li>
              <li className=' flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'UnFurnished'}
              </li>
            </ul>
            {user && user.userData._id !== listing.userRef && !contect &&(
                <button onClick={()=>setContect(true)} className=' bg-slate-700 text-white rounded-lg hover:opacity-95 p-3 uppercase'>
                contect lendlord
              </button>
            )}
            {contect && <Contact listing={listing}/>}
          </div>
          </>
 
        )
        
      }
    </main>

  )
}
