const Fuel = require('../models/fuelModel'); // Assuming the model file is in the "../models" directory

// Controller function to create a fuel document
const createFuel = async (req, res) => {
  try {
    // Extract the data from the request body
    const { dName, dlastName, vehicleNo, status, km, litre,splace,dplace } = req.body;

    // Create a new fuel document
    const fuel = new Fuel({
      dName,
      dlastName,
      vehicleNo,
      status,
      km,
      litre,
      splace,
      dplace
    });

    // Save the fuel document to the database
    await fuel.save();

    // Send a response indicating success
    res.status(201).json({ message: 'Fuel document created successfully', fuel });
  } catch (error) {
    // Handle any errors that occur during the creation process
    res.status(500).json({ error: 'An error occurred while creating the fuel document' });
  }
};

const getAllFuel = async (req, res) => {
  try {
    // Retrieve all fuel documents from the database in reverse order
    const fuels = await Fuel.find().sort({ createdAt: -1 });

    // Send the retrieved documents as a response
    res.status(200).json({ fuels });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({ error: 'An error occurred while fetching the fuel documents' });
  }
};
const getAllFuelstatus = async (req, res) => {
  try {
    // Retrieve all fuel documents with status "reviewing" from the database in reverse order
    const fuels = await Fuel.find({ status: 'reviewing' }).sort({ createdAt: -1 });

    // Send the retrieved documents as a response
    res.status(200).json({ fuels });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({ error: 'An error occurred while fetching the fuel documents' });
  }
};

  const updateFuelStatus = async (req, res) => {
    try {
      const { id } = req.params; // Extract the fuel ID from the request parameters
      const { status, litre } = req.body; // Extract the new status and litre from the request body
  
      // Find the fuel document by ID and update its status and litre
      const fuel = await Fuel.findByIdAndUpdate(
        id,
        { status, litre },
        { new: true }
      );
  
      if (!fuel) {
        // If the fuel document is not found, send a 404 response
        return res.status(404).json({ error: 'Fuel document not found' });
      }
  
      // Send the updated fuel document as a response
      res
        .status(200)
        .json({ message: 'Fuel document status and litre updated successfully', fuel });
    } catch (error) {
      // Handle any errors that occur during the update process
      res
        .status(500)
        .json({ error: 'An error occurred while updating the fuel document status and litre' });
    }
  };

  const getFuelByVehicleNo = async (req, res) => {
    try {
      const { vehicleNo } = req.params; // Extract the vehicle number from the request parameters
  
      // Find the fuel documents matching the provided vehicle number
      const fuels = await Fuel.find({ vehicleNo });
  
      // Send the retrieved documents as a response
      res.status(200).json({ fuels });
    } catch (error) {
      // Handle any errors that occur during the retrieval process
      res.status(500).json({ error: 'An error occurred while fetching the fuel documents' });
    }
  };
  const deleteFuel = async (req, res) => {
    try {
      const { id } = req.params; // Extract the fuel ID from the request parameters
  
      // Find the fuel document by ID and delete it
      const deletedFuel = await Fuel.findByIdAndDelete(id);
  
      if (!deletedFuel) {
        // If the fuel document is not found, send a 404 response
        return res.status(404).json({ error: 'Fuel document not found' });
      }
  
      // Send a response indicating success
      res.status(200).json({ message: 'Fuel document deleted successfully' });
    } catch (error) {
      // Handle any errors that occur during the deletion process
      res.status(500).json({ error: 'An error occurred while deleting the fuel document' });
    }
  };

module.exports = { createFuel,getAllFuel,updateFuelStatus,getFuelByVehicleNo,deleteFuel,getAllFuelstatus};