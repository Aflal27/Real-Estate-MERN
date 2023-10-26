import ErrorHandler from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import Listing from '../models/listingModel.js'

export const uploadeUser = async(req,res,next)=>{
    if(req.user.id !== req.params.id) return next(new ErrorHandler(401,'you can only update your own account'))
    
    try {
       if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
       }
       const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password,
            avatart:req.body.avatart
        }
       },{new:true})

       const {password, ...rest} = updateUser._doc

       res.status(200)
       .json(rest)

        
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req,res,next)=>{
    if(req.user.id !== req.params.id) return next(new ErrorHandler(401,'you can only delete your own account'))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('token')
        res
        .status(200)
        .json('user has been deleted!')
        

    } catch (error) {
        next(error)
    }
}
export const signOutUser = (req,res,next)=>{
    try {
        res.clearCookie('token')
        res
        .status(200)
        .json('User has been logged out!')
    } catch (error) {
        next(error)
    }
}

export const getUserListing = async (req,res,next)=>{
    if (req.user.id === req.params.id) {
        try {
         const listing = await Listing.find({userRef:req.params.id})
         
         res
         .status(200)
         .json(listing)   
        } catch (error) {
            next(error)
        }
    }else{
        return next(new ErrorHandler(401,'You can only view your own listings!'))
    }
}

export const getUser = async(req,res,next)=>{
    try {
       const user = await User.findById(req.params.id)
       if(!user) return next(new ErrorHandler(401),'user not found')

       const {password:pass,...rest} =user._doc

       res.status(200).json(rest)
       
    } catch (error) {
        next(error)
    }
}