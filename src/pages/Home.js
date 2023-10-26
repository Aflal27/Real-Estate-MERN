import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListing, setofferListing] = useState(null)
  const [saleListing, setSaleListing] = useState(null)
  const [rentListing, setRentListing] = useState(null)

  SwiperCore.use([Navigation])
  useEffect(()=>{
    const fatchOffer = async()=>{
      try {
        const {data} = await axios.get('/api/listing/get?offer=true&limit=4')
        setofferListing(data)
      } catch (error) {
        console.log(error);
      }
    } 
    fatchOffer()

    const fatchRent = async()=>{
      try {
        const {data} = await axios.get('/api/listing/get?type=rent&limit=4')
        setRentListing(data)
      } catch (error) {
        console.log(error);
      }
    } 
    fatchRent()

    const fatchSale = async()=>{
      try {
        const {data} = await axios.get('/api/listing/get?type=sale&limit=4')
        setSaleListing(data)
      } catch (error) {
        console.log(error);
      }
    } 
    fatchSale()
  },[])
  return (
    <div>
       {/* top */}
        <div className=' flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className=' text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find Your Next <span className=' text-slate-700'>perfect</span>
            <br/>
            place with ease
          </h1>
          <div className=' text-gray-400 text-xs sm:text-sm'>
            Aflal Estate is the best place to find your next
            perfect place to live.
            <br/>
            We have a wide range of properties for you to 
            choose from.
        </div>
          <Link className=' text-blue-700 font-bold text-xs sm:text-sm hover:underline' to={'/search'}>
            Let's Start now...
          </Link>
        </div>
        

      {/* swiper */}
      <div>
          <Swiper navigation>
            {
              offerListing &&
              offerListing.length > 0 &&
              offerListing.map((list)=>(
                <SwiperSlide Navigation>
                  <div
                  style={{
                    background: `url(${list.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px]'
                  key={list._id}>
                  
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
      </div>
      
      
      {/* listing result for offer, sale and rent */}
        <div>
          {
            offerListing && offerListing.length > 0 &&(
              <div className=' max-w-6xl mx-auto flex flex-col p-3 gap-5 my-10'>
                  <div className=' my-3'>
                    <h2 className=' text-2xl font-semibold text-slate-600'>Recent offer</h2>
                    <Link className=' text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                      Show more offer
                    </Link>
                  </div>
                  <div className=' flex flex-wrap gap-4'>
                    {
                      offerListing.map((list)=>(
                        <ListingItem list={list} key={list._id} />
                      ))
                    }
                  </div>
              </div>
            )
          }

          {
            rentListing && rentListing.length > 0 &&(
              <div className=' max-w-6xl mx-auto flex flex-col p-3 gap-5 my-10'>
                  <div className=' my-3'>
                    <h2 className=' text-2xl font-semibold text-slate-600'>Recent place for rent</h2>
                    <Link className=' text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                      Show more places for rent
                    </Link>
                  </div>
                  <div className=' flex flex-wrap gap-4'>
                    {
                      rentListing.map((list)=>(
                        <ListingItem list={list} key={list._id} />
                      ))
                    }
                  </div>
              </div>
            )
          }

          {
            saleListing && saleListing.length > 0 &&(
              <div className=' max-w-6xl mx-auto flex flex-col p-3 gap-5 my-10'>
                  <div className=' my-3'>
                    <h2 className=' text-2xl font-semibold text-slate-600'>Recent place for sale</h2>
                    <Link className=' text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                      Show more places for sale
                    </Link>
                  </div>
                  <div className=' flex flex-wrap gap-4'>
                    {
                      saleListing.map((list)=>(
                        <ListingItem list={list} key={list._id} />
                      ))
                    }
                  </div>
              </div>
            )
          }
        </div>
    </div>

  )
}
