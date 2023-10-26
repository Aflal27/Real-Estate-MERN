import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { deleteUserFail, deleteUserRequset, deleteUserSuccess, signOutUserFail, signOutUserRequset, signOutUserSuccess, updateUserFail, updateUserRequset, updateUserSuccess } from '../slices/userSlice'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function UserProfile() {
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 * 1024 *1024 &&
  //     request.resource.contentType.matches('image/.*')
  const {user} = useSelector(state=>state.persistreducer)
  const fileRef = useRef(null) 
  const [file, setFile] = useState(undefined)
  const [filePrec,setFilePrec] = useState(0)
  const [fileUploadeError, setFileUploadeError] = useState(false)
  const [formData , setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [userListing,setUserListing] = useState([])
  const [listingError, setListingError] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=>{
    if (file) {
      handleFileUploade(file)
    }
  },[file])

  const handleFileUploade = (file)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage,fileName)
    const uploadeTask = uploadBytesResumable(storageRef,file)

    uploadeTask.on('state_changed',
    (snapshot)=>{
      const prograss = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePrec(Math.round(prograss))
    },
    (error)=>{
      setFileUploadeError(true)
    },
    ()=>{
      getDownloadURL(uploadeTask.snapshot.ref)
      .then((downloadeUrl)=> setFormData({...formData , avatart:downloadeUrl}))
    });
  } 
  
  const handleChange = (e) =>{
    setFormData({...formData , [e.target.id]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserRequset())
      const {data} = await axios.post(`/api/user/update/${user.userData._id}`,formData,{withCredentials:true})
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFail(error.response.data.message))
    }
  }
  const handleDelete = async ()=>{
    try {
      dispatch(deleteUserRequset())
      const {data} = await axios.delete(`/api/user/delete/${user.userData._id}`)
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFail(error.response.data.message))
    }
  }
  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserRequset)
      const {data} = await axios.get('/api/user/signout')
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFail(error.response.data.message))
    }
  }

  const handelShowListing = async()=>{
    try {
      const {data} = await axios.get(`/api/user/listing/${user.userData._id}`)
      setUserListing(data)
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const handleListingDelete = async(id)=>{
    try {
      await axios.delete(`/api/listing/delete/${id}`)
     setUserListing((prev)=>prev.filter((list)=>list._id !== id))

    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' font-semibold text-3xl text-center my-3'>Profile</h1>
      
      <form onSubmit={handleSubmit} className=' flex flex-col gap-4'>
        <input 
        type='file' 
        ref={fileRef} 
        hidden 
        accept='image/*'
        onChange={(e)=>setFile(e.target.files[0])}/>
        
        <img
        src={formData?.avatart || user.userData.avatart}
        alt='profile'
        className=' w-24 h-24 rounded-full cursor-pointer object-cover self-center'
        onClick={()=>fileRef.current.click()}/>

        <p className=' text-sm text-center'>
          {
            fileUploadeError ? 
            (<span className=' text-red-700'>Image Uploade Error(image must be less than 2mb)</span>)
            : filePrec > 0 && filePrec < 100 ? 
            (<span className=' text-slate-700'>{`Uploadin ${filePrec}%`}</span>)
            : filePrec === 100 ?
            (<span className=' text-green-700'>Image Successfully Uploaded!</span>)
            : ('')
          }
        </p>
        <input
        type='text'
        placeholder='userName'
        defaultValue={user.userData.userName}
        className=' p-3 rounded-lg border'
        id='userName'
        onChange={handleChange}/>
        <input
        type='email'
        defaultValue={user.userData.email}
        placeholder='email'
        className=' p-3 rounded-lg border'
        id='email'
        onChange={handleChange}/>
        <input
        type='password'
        placeholder='password'
        className=' p-3 rounded-lg border'
        id='password'
        onChange={handleChange}/>
        <button className=' bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-75 uppercase cursor-pointer'>
          {
            user.loading ? 'Loading...' : 'Update'
          }
        </button>
        <Link
         className=' bg-green-700 p-3 rounded-lg text-white text-center hover:opacity-95'
         to={'/cratelisting'}>
          Create listing
        </Link>
      </form>
      
      <div className=' flex justify-between mt-4'>
        <span onClick={handleDelete} className=' text-red-700 cursor-pointer'>Delete Accout</span>
        <span onClick={handleSignOut} className=' text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className=' text-red-700 mt-5'>
        {user.error ? user.error : ""}
      </p>
      <p className=' text-green-700 mt-5'>
        {updateSuccess? "User is Update Successfully!":""}
      </p>
      <button 
      onClick={handelShowListing}
      className=' text-green-700 w-full'>Show Listing</button>

      <p className=' text-red-700 text-sm '> {listingError ? listingError : ''} </p>

      {
        userListing && userListing.length > 0 &&
        <div className=' flex flex-col gap-4'>
          <h1 className=' text-center font-semibold text-2xl my-5'> Your Listing </h1>
           { userListing.map((listing)=>(
          
          <div className=' gap-4 border rounded-lg p-3 flex items-center justify-between'>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} 
                alt='listing cover image'
                className=' h-16 w-16 object-contain'
                />
            </Link>

            <Link className=' text-slate-700 font-semibold flex-1 hover:underline' to={`/listing/${listing._id}`}>
                <p >{listing.name}</p>
            </Link>

            <div className=' flex flex-col'>
                <button onClick={()=>handleListingDelete(listing._id)} className=' text-red-700 uppercase'>
                    delete
                </button>
                <button className=' text-green-700 uppercase'>
                  <Link to={`/updatelisting/${listing._id}`}>
                     edit
                  </Link>
                </button>
            </div>
          </div>
        ))}
        </div>
        
      }
    </div>
  )
}
