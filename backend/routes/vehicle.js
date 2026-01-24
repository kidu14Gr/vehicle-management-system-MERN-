const express=require('express')
const router=express.Router()

const {
    createVehicle,getAllVehicles,updateDriverId
} = require('../controllers/vehicleController')

router.post('/', createVehicle)
router.get('/', getAllVehicles)
router.patch('/:id', updateDriverId)


module.exports=router;
