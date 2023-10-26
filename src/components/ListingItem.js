import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({list}) {
  return (
    <div className=' bg-white shadow-md hover:shadow-lg overflow-hidden rounded-lg w-full sm:w-[320px]'>
        <Link className=' flex flex-col gap-1 w-full p-3' to={`/listing/${list._id}`}>
            <img src={list.imageUrls[0]} 
            alt='listing cover'
            className=' h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300 w-full'/>

            <div className=' p-3'>
                <p className=' text-lg text-slate-700 font-semibold truncate'>{list.name}</p>
            </div>
            
            <div className=' flex items-center gap-1'>
                <MdLocationOn className=' h-4 w-4 text-green-700'/>
                <p className=' text-sm text-gray-600 truncate w-full'>{list.address}</p>
            </div>

            <div>
                <p className=' text-sm text-gray-600 line-clamp-2'>{list.description}</p>
            </div>

            <div>
                <p className=' text-slate-500 font-semibold mt-2'>
                   $ {
                        list.offer
                        ? list.discountPrice
                        :list.regulerPrice
                    }
                    {
                        list.type === 'rent' && '/ month'
                    }
                </p>
            </div>

            <div className=' flex gap-4 text-slate-700'>
                <div className=' font-bold text-sm'>
                    {
                        list.bedroom > 1
                        ? ` ${list.bedroom} Beds`
                        : ` ${list.bedroom} Bed`
                    }
                </div>
                <div  className=' font-bold text-sm'>
                    {
                        list.bathroom > 1
                        ?` ${list.bedroom} Baths`
                        :` ${list.bedroom} Bath`
                    }
                </div>

            </div>
        </Link>
    </div>
  )
}
