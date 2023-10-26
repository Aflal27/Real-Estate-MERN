import React, { useEffect, useState } from 'react'
import {getStorage,getDownloadURL,ref,uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
  const [files, setFiles] = useState([])
  const [uploade, setUploade] = useState(false)
  const [imageUploadeError, setImageUploadeError] = useState(false)
  const [uploadeError, setUploadeError] = useState(null)
  const [loading, setLoading] = useState(false)
  const {user} = useSelector(state=>state.persistreducer)
  const navigate = useNavigate()
  const {id} = useParams()
  const [formData,setFormData]= useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    regulerPrice:50,
    discountPrice:50,
    bathroom:1,
    bedroom:1,
    furnished:false,
    parking:false,
    type:'rent',
    offer:false,
    userRef:user.userData._id


  })
  
  useEffect(()=>{
      const fetchListing = async()=>{
          const listId = id
          try {
           const {data}= await axios.get(`/api/listing/get/${listId}`)
           setFormData(data)
          } catch (error) {
            console.log(error);
          }
      }
      fetchListing()
  },[])
  const handelImage = (e)=>{
    e.preventDefault()
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploade(true)
      setImageUploadeError(false)
      const promises = []
      for(let i = 0; i < files.length; i++){
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises)
      .then((urls)=>{
        setFormData({
          ...formData,
          imageUrls:formData.imageUrls.concat(urls)
        })
        setImageUploadeError(false)
        setUploade(false)
        
      })
      .catch((err)=>{
        setImageUploadeError('Image upload failed (2 mb max per image)');
        setUploade(false)

      })
    }
    else{
      setImageUploadeError('You can only upload 6 images per listing');
      setUploade(false)
    }
  }

  const storeImage = async(file)=>{
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storageRef,file)
      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes)*100;
          console.log(`uploade ${progress}`);
        },
        (error)=>{
          reject(error)
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            resolve(downloadUrl)
          })
        }
      )
    })
  }
// delete fun
  const handleRemoveImage = (index)=>{
    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_,i)=> i!==index)
    })
  }

  const handelChange = (e)=>{
    if (
      e.target.id === 'sale' || 
      e.target.id === 'rent') {
      setFormData({
        ...formData,
        type:e.target.id
      })
    }
    if (e.target.id === 'parking' || 
    e.target.id === 'furnished' ||
    e.target.id ==='offer') {
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }

  }
 
  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(formData.imageUrls < 1) return setUploadeError('you must uploade at least one image')
    if(+formData.regulerPrice < +formData.discountPrice) return setUploadeError('Discout price must be lower than reguler price ') 
    try {
      setLoading(true)
      const {data} = await axios.post(`/api/listing/update/${id}`,formData)
      setLoading(false)
      navigate(`/listing/${data._id}`)
    } catch (error) {
      console.log(error);
      setLoading(false)
      setUploadeError(error.response.data.message)
      if(error.response.data.message === "Unauthorized" ){
        setUploadeError('Unauthorized (please try again sign in)')
      }
    }
  }
  return (
    <main className=' p-3 max-w-4xl mx-auto'>
      <h1 className=' text-xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className=' flex flex-col sm:flex-row sm:gap-5'>
        <div className=' flex flex-col gap-4 flex-1'>
          <input
          className=' p-3 rounded-lg border'
          type='text'
          placeholder='Name'
          id='name'
          maxLength='62'
          minLength= '10'
          required 
          onChange={handelChange}
          value={formData.name}/>
          
          <textarea
          className=' p-3 rounded-lg border'
          type='text'
          placeholder='Description'
          id='description'
          maxLength=''
          minLength= '10' 
          required
          onChange={handelChange}
          value={formData.description}/>
         
          <input
          className=' p-3 rounded-lg border'
          type='text'
          placeholder='Address'
          id='address'
          maxLength='62'
          minLength= '10'
          required 
          onChange={handelChange}
          value={formData.address}
          />
        
        <div className=' flex flex-wrap gap-4 mt-4'>
          <div className=' flex gap-2'>
            <input className=' w-5' type='checkbox' id='sale' 
            onChange={handelChange}
            checked={formData.type === 'sale'}/>
            <span>Sell</span>
          </div>
          <div className=' flex gap-2'>
            <input className=' w-5' type='checkbox' id='rent' onChange={handelChange}
            checked={formData.type === 'rent'}/>
            <span>Rent</span>
          </div>
          <div className=' flex gap-2'>
            <input className=' w-5' type='checkbox' id='parking' onChange={handelChange}
            checked={formData.parking}/>
            <span>Parking Sport</span>
          </div>
          <div className=' flex gap-2'>
            <input className=' w-5' type='checkbox' id='furnished' onChange={handelChange}
            checked={formData.furnished}/>
            <span>Furnished</span>
          </div>
          <div className=' flex gap-2'>
            <input className=' w-5' type='checkbox' id='offer' onChange={handelChange}
            checked={formData.offer}/>
            <span>Offer</span>
          </div>
        </div>

        <div className=' flex flex-wrap gap-6 mt-4'>
          <div className=' flex items-center gap-2'>
            <input
            type='number'
            max='10'
            min='1'
            required
            className=' p-3 border border-gray-300 rounded-lg'
            id='bedroom'
            onChange={handelChange}
            value={formData.bedroom}/>
            <span>Beds</span>
          </div>
          <div className=' flex items-center gap-2'>
            <input
            type='number'
            max='10'
            min='1'
            required
            className=' p-3 border border-gray-300 rounded-lg'
            id='bathroom'
            onChange={handelChange}
            value={formData.bathroom}/>
            <span>Baths</span>
          </div>
          <div className=' flex items-center gap-2'>
            <input
            type='number'
            max='100000'
            min='50'
            required
            className=' p-3 border border-gray-300 rounded-lg'
            id='regulerPrice'
            onChange={handelChange}
            value={formData.regulerPrice}/>
             
             <div className=' flex flex-col items-center'>
              <p>Reguler price</p>
              <span className=' text-xs'>($ / month)</span>
            </div>

          </div>
          {
            formData.offer && (
              <div className=' flex items-center gap-2'>
            <input
            type='number'
            max='100000'
            min='0'
            required
            className=' p-3 border border-gray-300 rounded-lg'
            id='discountPrice'
            onChange={handelChange}
            value={formData.discountPrice}/>
            
            <div className=' flex flex-col items-center'>
              <p>Discount price</p>
              <span className=' text-xs'>($ / month)</span>
            </div>
           
          </div>
            )
          }
          
        </div>
      </div>

      <div className=' flex flex-col flex-1 gap-5'>
        <p className=' font-semibold'>Images:
          <span className=' font-normal text-gray-600 sm:ml-2'>The first image will be the cover (max 6)</span>
        </p>
        <div className='  flex gap-3 items-center'>
          <input
          type='file'
          className='p-3  border border-gray-300  w-full rounded-lg mt-1'
          accept='image/*' 
          multiple
          id='images'
          onChange={(e)=> setFiles(e.target.files)}/>
          <button onClick={handelImage} type='button' className=' p-3 uppercase rounded-lg hover:shadow-lg disabled:opacity-80 text-green-600 border border-green-700'>
            {uploade ? 'Uploading...':'Upload'}
          </button>
        </div>
        <p className=' text-red-700 text-sm'>
          {imageUploadeError && imageUploadeError}
        </p>
        {
          formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
            <div key={url} className=' flex items-center justify-between p-3 border'>
              <img className=' rounded-lg w-20 h-20 object-contain' src={url} alt='listing image' />
              <button onClick={()=>handleRemoveImage(index)} type='button' className=' text-red-700 uppercase rounded-lg hover:opacity-75 border p-3'> Delete </button>
            </div>
          ))
        }
        <button 
        disabled={loading || uploade}
        className='p-3 bg-slate-600 text-white rounded-lg hover:opacity-95 disabled:opacity-80 uppercase '>
         {
          loading ? 'Updateing...' : 'Update Listing'
         }
      </button>
      <p className=' text-red-700 text-sm' >{uploadeError}</p>
      </div>
     
      </form>
    </main>
  )
}
