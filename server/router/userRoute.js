import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { deleteUser, getUser, getUserListing, signOutUser, uploadeUser, } from '../controller/userController.js'
const router = express.Router()

router.post('/update/:id',verifyToken,uploadeUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/signout',verifyToken,signOutUser)
router.get('/listing/:id',verifyToken,getUserListing)
router.get('/:id',verifyToken,getUser)


export default router