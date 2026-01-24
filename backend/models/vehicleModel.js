const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    oiltype: {
    type: String,
    required: true
  },
  
  driverId: {
    type: String,
    required: false
  },
  vehicleName: {
        type: String,
        required: true
      },
      vehicleNo: {
        type: String,
        required: true
      },
      vimage: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true
  }
 
},{timestamps:true});

module.exports = mongoose.model('vehicle',vehicleSchema)
