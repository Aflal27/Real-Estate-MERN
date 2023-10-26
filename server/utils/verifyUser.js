import  Jwt  from "jsonwebtoken"
import ErrorHandler from "./error.js"
import User from "../models/userModel.js"

export const verifyToken = async(req,res,next)=>{
    const token = req.cookies.token

    if(!token) return next(new ErrorHandler(401,'Unauthorized'))

   const decoded = Jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
}