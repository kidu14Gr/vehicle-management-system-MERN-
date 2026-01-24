const express=require('express')
const router=express.Router()

const {
    createReport,updateDestStatus,getAllReports,getReportsByVehicleNo
} = require('../controllers/reportController')

router.post('/', createReport)
router.patch('/:id', updateDestStatus)
router.get('/',getAllReports)
router.get('/:vehicleNo',getReportsByVehicleNo)


module.exports=router;
