import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Search() {
    const navigate = useNavigate()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    // const [showMore, setShowMore] = useState(false)
    const [sildeBarData, setSildeBarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })
    const handleChange = (e)=>{
        if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setSildeBarData({...sildeBarData , type:e.target.id})
        }
        if (e.target.id === 'searchTerm') {
            setSildeBarData({...sildeBarData , searchTerm:e.target.value})
        }
        if (e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
            setSildeBarData({...sildeBarData , [e.target.id]:e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc'

            setSildeBarData({...sildeBarData , sort,order})
        }

    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm',sildeBarData.searchTerm)
        urlParams.set('type',sildeBarData.type)
        urlParams.set('parking',sildeBarData.parking)
        urlParams.set('furnished',sildeBarData.furnished)
        urlParams.set('offer',sildeBarData.offer)
        urlParams.set('sort',sildeBarData.sort)
        urlParams.set('order',sildeBarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const searchTermForm = urlParams.get('searchTerm')
      const typeForm = urlParams.get('type')
      const parkingForm = urlParams.get('parking')
      const furnishedForm = urlParams.get('furnished')
      const offerForm = urlParams.get('offer')
      const sortForm = urlParams.get('sort')
      const orderForm = urlParams.get('order')
    
      if (
        searchTermForm ||
        typeForm||
        parkingForm||
        furnishedForm||
        offerForm||
        sortForm||
        orderForm
        ) {
        setSildeBarData({
            searchTerm:searchTermForm||'',
            type:typeForm||'all',
            parking:parkingForm === 'true' ? true : false,
            furnished:furnishedForm === 'true' ? true :false,
            offer:offerForm === 'true' ? true : false,
            sort:sortForm || 'created_at',
            order:orderForm || 'desc'
        })
      }

      const fatch = async()=>{
        try {
            const searchQuery = urlParams.toString()
            setLoading(true)
          const {data} =  await axios.get(`/api/listing/get?${searchQuery}`)
           setListing(data)
           setLoading(false) 
           if (data.length > 8) {
            setShowMore(true)
           }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
      }
      fatch()
    },[location.search])
  return (
        <div className=' flex flex-col md:flex-row'>
            <div className=' p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className=' flex flex-col gap-8'>
                    <div  className=' flex items-center gap-2'>
                        <label className=' whitespace-nowrap font-semibold'>Search Term:</label>
                        <input 
                        type='text'
                        placeholder='Search...'
                        id='searchTerm'
                        className=' border p-3 rounded-lg w-full'
                        value={sildeBarData.searchTerm}
                        onChange={handleChange}
                        />
                    </div>
                    <div className=' flex gap-2 items-center flex-wrap'>
                        <div className=' flex gap-2'>
                            <label className=' font-semibold'>Type:</label>
                            <input
                            type='checkbox'
                            id='all'
                            className=' w-5'
                            onChange={handleChange}
                            checked={sildeBarData.type === 'all'}/>
                            <span>Rent & Sale</span>
                        </div>
                        <div className=' flex gap-2'>
                            <input
                            type='checkbox'
                            id='rent'
                            className=' w-5'
                            onChange={handleChange}
                            checked={sildeBarData.type === 'rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className=' flex gap-2'>
                            <input
                            type='checkbox'
                            id='sale'
                            className=' w-5'
                            onChange={handleChange}
                            checked={sildeBarData.type === 'sale'}/>
                            <span>Sale</span>
                        </div>
                        <div className=' flex gap-2'>
                            <input
                            type='checkbox'
                            id='offer'
                            className=' w-5'
                            onChange={handleChange}
                            checked={sildeBarData.offer}/>
                            <span>Offer</span>
                        </div> 
                    </div>

                    <div className=' flex items-center gap-4'>
                    <div className=' flex gap-2'>
                        <label className=' font-semibold'>Amenitles:</label>
                        <input
                        type='checkbox'
                        id='parking'
                        className=' w-5'
                        onChange={handleChange}
                        checked={sildeBarData.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className=' flex gap-2'>
                            <input
                            type='checkbox'
                            id='furnished'
                            className=' w-5'
                            onChange={handleChange}
                            checked={sildeBarData.furnished}/>
                            <span>Furnished</span>
                        </div>
                    </div>
                   
                   
                   <div className=' flex gap-2 items-center'>
                        <label className=' font-semibold'>Sort:</label>
                        <select 
                        onChange={handleChange}
                        defaultValue={'created_at_desc'}
                         id='sort_order' className=' border p-3 rounded-lg'>
                            <option value={'regulerPrice_desc'} >Price high to low</option>
                            <option value={'regulerPrice_asc'} >Price low to high</option>
                            <option value={'createdAt_desc'} >Latest</option>
                            <option value={'createdAt-asc'} >Oldest</option>

                        </select>
                   </div>
                   <button className=' bg-slate-700 bordr text-white uppercase p-3 rounded-lg hover:opacity-95'>
                    Search
                   </button>
                </form>
            </div>
            

            <div className=' flex-1'>
                <h1 className=' text-3xl text-slate-700 p-3 mt-5 font-semibold'>Listing results:</h1>
                <div className=' text-xl p-3 text-slate-700'>
                    {
                        !loading && listing && listing.length === 0 && (
                            <p>No listing found!</p>
                        )
                    }
                    {
                        loading && (
                            <p className=' text-center text-xl'>Loading...</p>
                        )
                    }
                    {
                        !loading && listing && listing.map((list)=>(
                            <ListingItem key={list._id} list={list} />
                        ))
                    }

                    {/* {
                        showMore && (
                            <button
                            className=' text-green-700 hover:underline p-7 text-center w-full'
                             onClick={onShowMoreClick()}>
                                Show More
                            </button>
                        )
                    } */}
                </div>
            </div>
        </div>
  )
}
