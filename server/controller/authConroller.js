import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import ErrorHandle from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signUp = async (req,res,next)=>{
    try {
        const {userName,email,password} = req.body
    
        // encrypt sent our password 
        const hashPassword = bcrypt.hashSync(password,10)
        const newUser = new User({userName,email,password:hashPassword})
        await newUser.save()
    
        res.status(201).json({
            message:'success',
            
        })
    } catch (error) {
        next(error)
    }
} 

export const signIn = async(req,res,next)=>{
    const {email,password} = req.body
    try {
        const valideUser = await User.findOne({email})
        if(!valideUser) return next(new ErrorHandle(404,'User Not Found!'))
        const validPassword = bcrypt.compareSync(password,valideUser.password)
        if(!validPassword) return next(new ErrorHandle(401,'Worng credentils!'))
        
        const token = jwt.sign({id:valideUser._id},process.env.JWT_SECRET)
       
        // cancel password
        const {password:pass, ...rest} = valideUser._doc

        res
        .cookie('token',token,{httpOnly:true})
        .status(200)
        .json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async(req,res,next)=>{
    try {
       const user = await User.findOne({email:req.body.email}) 
       if (user) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res
            .cookie('token',token,{httpOnly:true})
            .status(200)
            .json(user)
       }
       else{
        const genratedPassword =Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
        const hashedPassword = bcrypt.hashSync(genratedPassword,10)
        const newUser = User({
            userName:req.body.name.split(' ').join('').toLowerCase()+Math.random().toString(36).slice(-4),
            email:req.body.email,
            password:hashedPassword,
            avatart:req.body.photo
        });
        await newUser.save()
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
        
        // can this password cancel
        const {password:pass, ...rest} = newUser._doc

        res
        .cookie('token',token)
        .status(200)
        .json(rest)
       }
    } catch (error) {
        next(error)
    }
}