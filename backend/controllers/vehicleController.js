const Vehicle = require('../models/vehicleModel');

const createVehicle = async (req, res) => {
  const { oiltype, driverId, vehicleName, vehicleNo, vehicleType } = req.body;
  const vimage = req.file; // Get the uploaded profile image file

  // Add validation checks
  if (!oiltype) {
    return res.status(400).json({ error: "Oil type is required." });
  }

  if (!driverId) {
    return res.status(400).json({ error: "Driver ID is required." });
  }

  if (!vehicleName) {
    return res.status(400).json({ error: "Vehicle name is required." });
  }

  if (!vehicleNo) {
    return res.status(400).json({ error: "Vehicle number is required." });
  }

  if (!vimage) {
    return res.status(400).json({ error: "Vehicle image is required." });
  }

  if (!vehicleType) {
    return res.status(400).json({ error: "Vehicle type is required." });
  }

  try {
    const vimageFilename = vimage.filename; // Extract the filename from the uploaded file
    const vehicle = await Vehicle.create({
      oiltype,
      driverId,
      vehicleName,
      vehicleNo,
      vimage: vimageFilename, // Store the filename in the vimage field
      vehicleType
    });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllVehicles = async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const updateDriverId = async (req, res) => {
    const { id } = req.params;
    const {driverId} = req.body;
  
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(id, { driverId }, { new: true });
  
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
  
      res.status(200).json(vehicle);
    } catch (error) {
      console.error('Error updating driverId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
  createVehicle,getAllVehicles,updateDriverId
};