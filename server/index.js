import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
import authRouter from './router/authRoute.js'
// import cors from 'cors'
import cookieParser from "cookie-parser";
import userRouter from './router/userRoute.js'
import listingRouter from './router/listingRouter.js'
import path from 'path'


const app = express();
app.use(express.json());
app.use(cookieParser())


// mondoDB 
mongoose.connect(process.env.MONG_KEY)
.then(()=>{
    console.log("mogodb connected");
})
.catch((err)=>{
    console.log(err);
})

app.listen(8000,()=>{
    console.log('server is running ');
})

// build
const __dirname = path.resolve()


// router
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)

// build


// middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})