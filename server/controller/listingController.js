import Listing from "../models/listingModel.js"
import ErrorHandler from '../utils/error.js'

export const createListing = async(req,res,next)=>{
    try {
        const list = await Listing.create(req.body)
        res
        .status(200)
        .json(list)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async(req,res,next)=>{
    const list = await Listing.findById(req.params.id)

     if(list.userRef !== req.user.id) return next(new ErrorHandler(401,'delete your own listing'))
    if(!list) return next(new ErrorHandler(404,'Listing not found'))

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("listing has been deleted!")
    } catch (error) {
        next(error)
    }
}

export const updateListing = async(req,res,next)=>{
    const list = await Listing.findById(req.params.id)

    if(!list) return next(new ErrorHandler(404,'Listing not found'))
    if(list.userRef !== req.user.id) return next(new ErrorHandler(401,'update your own listing'))

    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true})
        res.status(200).json(updateListing)
    } catch (error) {
        next(error)
    }
}

export const getListing = async(req,res,next)=>{
    try {
        const list = await Listing.findById(req.params.id)
        if (!list) {
            next(new ErrorHandler(404,'listing not found'))
        }
        res.status(200).json(list)
    } catch (error) {
        next(error)
    }
   
}

export const getListings = async(req,res,next)=>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = {$in:[false,true]};
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished==='false') {
            furnished = {$in:[false,true]}
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = {$in:[true,false]}
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type={$in:["sale",'rent']}
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc'

        const listings = await Listing.find({
            name:{$regex:searchTerm, $options:'i'},
            offer,
            furnished,
            parking,
            type,
        })
        .sort({[sort]:order})
        .limit(limit)
        .skip(startIndex)

        return res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
}