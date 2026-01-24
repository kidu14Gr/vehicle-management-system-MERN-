require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouters = require('./routes/user');
const deployRouters = require('./routes/deployer');
const vehicleRouters = require('./routes/vehicle');
const fuelRouters = require('./routes/fuel');
const reportRouters = require('./routes/report');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

//middleware
app.use(express.json());
app.use(cors()); //enable cors
app.use((req,res,next) => {
    console.log(req.path , req.method);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage and file filtering
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
       
        if (file.fieldname === 'pimage'){
            cb(null, 'uploads/pimages');
          }
          else if (file.fieldname === 'vimage'){
            cb(null, 'uploads/vimages');
          }
        else {
            cb(new Error('Invalid fieldname'));
        }
    },

    filename: (req, file, cb) => {
        // Set the filename for images and videos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    
})

// Create a multer instance with the configured storage
const upload = multer({ storage });

//routes
app.use('/api/user',upload.single('pimage'), userRouters);
app.use('/api/vehicle',upload.single('vimage'), vehicleRouters);
app.use('/api/deployer', deployRouters);
app.use('/api/fuel', fuelRouters);
app.use('/api/report', reportRouters);
//connect to database
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
        console.log("connect to database, listening on port",process.env.PORT)
    })
})
.catch((error) => {
    console.log(error);
})