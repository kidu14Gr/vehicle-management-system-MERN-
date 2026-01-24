const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    firstName: {
    type: String,
    required: true
  },
  
  lastName: {
    type: String,
    required: false
  },
  vehicleNo: {
        type: String,
        required: true
      },

      km: {
    type: Number,
    required: true,
  },
  litre: {
    type: Number,
    required: true,
  },
destStatus:{
  type: String,
  required: false
},
splace:{
  type: String,
  required: false
},
dplace:{
  type: String,
  required: false
}



},{timestamps:true});

module.exports = mongoose.model('report',reportSchema)
