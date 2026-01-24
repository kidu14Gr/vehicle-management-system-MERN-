const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deployerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  
  lastName: {
    type: String,
    required: true
  },
    slat: {
        type: String,
        required: true
      },
      slong: {
        type: String,
        required: true
      },
  dlat: {
    type: String,
    required: true,
  },
  dlong: {
    type: String,
    required: true
  },
  email: {
    type: String, // Assuming the image field stores the filenames
    required: true,
  },
  splace: {
    type: String, // Assuming the image field stores the filenames
    required: true,
  },
  dplace: {
    type: String, // Assuming the image field stores the filenames
    required: true,
  },
  km: {
    type: Number, // Assuming the image field stores the filenames
    required: true,
  },
 
},{timestamps:true});

module.exports = mongoose.model('deployer',deployerSchema)
