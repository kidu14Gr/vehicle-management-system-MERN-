const express = require('express')
const router = express.Router()
//controller functions
const {signupUser , loginUser , getUserByEmail, getAllUsers, updateUserById, deleteUserById, getAllDrivers,getAllDriversno,updateUserVehicleNo} = require('../controllers/userController') 
router.get('/drivers', getAllDrivers)
router.get('/drivers/no', getAllDriversno)

router.post('/login' , loginUser)
//signup route
router.post('/signup' , signupUser)

router.get('/:email' , getUserByEmail)
router.get('/', getAllUsers)
router.patch('/update/:id',  updateUserById)
router.delete('/delete/:id', deleteUserById)
router.patch('/:id', updateUserVehicleNo)

module.exports = router