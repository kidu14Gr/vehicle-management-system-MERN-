const express=require('express')
const router=express.Router()

const {
    createDeployer,fetchDeployByEmail,fetchAllDeploys,deleteDeployByEmail, acknowledgeMission
} = require('../controllers/deployerController')
router.delete('/delete/:email',deleteDeployByEmail)
router.get('/deploy', fetchAllDeploys)
router.post('/', createDeployer);
router.patch('/acknowledge/:id', acknowledgeMission);
router.get('/:email', fetchDeployByEmail)

module.exports=router;
