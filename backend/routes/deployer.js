const express=require('express')
const router=express.Router()

const {
    createDeployer,fetchDeployByEmail,fetchAllDeploys,deleteDeployByEmail
} = require('../controllers/deployerController')
router.delete('/delete/:email',deleteDeployByEmail)
router.get('/deploy', fetchAllDeploys)
router.post('/', createDeployer);
router.get('/:email', fetchDeployByEmail)

module.exports=router;
