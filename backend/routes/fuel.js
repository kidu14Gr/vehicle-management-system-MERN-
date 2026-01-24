const express=require('express')
const router=express.Router()

const {
    createFuel,getAllFuel,updateFuelStatus,getFuelByVehicleNo,deleteFuel,getAllFuelstatus
} = require('../controllers/fuelController')

router.post('/', createFuel)
router.get('/', getAllFuel)
router.get('/status', getAllFuelstatus)
router.patch('/:id', updateFuelStatus)
router.get('/:vehicleNo', getFuelByVehicleNo)
router.delete('/:id', deleteFuel)

module.exports=router;
