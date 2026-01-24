const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuelSchema = new Schema({
    dName: {
    type: String,
    required: true
  },
  
  dlastName: {
    type: String,
    required: false
  },
  vehicleNo: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      km: {
    type: Number,
    required: true,
  },
  litre: {
    type: Number,
    required: false,
  },
  splace: {
    type: String,
    required: false,
  },
  dplace: {
    type: String,
    required: false,
  }

},{timestamps:true});

module.exports = mongoose.model('fuel',fuelSchema)
