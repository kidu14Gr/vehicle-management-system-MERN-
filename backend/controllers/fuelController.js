const Fuel = require('../models/fuelModel');
const { createNotification } = require('./notificationController');
const User = require('../models/userModel');

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

    // Create notification for fuel manager
    const date = new Date().toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
    await createNotification(
      'fuel manager',
      null,
      'fuel_request',
      'New Fuel Request',
      `You have a new fuel request from ${dName} ${dlastName} on ${date}.`,
      {
        fuelId: fuel._id,
        driverName: `${dName} ${dlastName}`,
        vehicleNo,
        km,
        splace,
        dplace
      }
    );

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

      // Get driver email from vehicle number
      const driver = await User.findOne({ vehicleNo: fuel.vehicleNo, role: 'driver' });
      const driverEmail = driver ? driver.email : null;
      const date = new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      });
      const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });

      // Create notification for driver
      if (status === 'successed' || status === 'approved') {
        await createNotification(
          'driver',
          driverEmail,
          'fuel_approved',
          'Fuel Request Approved',
          `Your fuel request has been approved on ${date} at ${time}. ${litre} liters allocated for your mission from ${fuel.splace} to ${fuel.dplace}.`,
          {
            fuelId: fuel._id,
            litre,
            vehicleNo: fuel.vehicleNo,
            splace: fuel.splace,
            dplace: fuel.dplace,
            date,
            time
          }
        );

        // Notify Dean about fuel approval
        await createNotification(
          'dean',
          null,
          'fuel_approved',
          'Fuel Request Approved',
          `Fuel request from ${fuel.dName} ${fuel.dlastName} (${fuel.vehicleNo}) was approved on ${date} at ${time}.`,
          {
            fuelId: fuel._id,
            driverName: `${fuel.dName} ${fuel.dlastName}`,
            vehicleNo: fuel.vehicleNo,
            litre,
            date,
            time
          }
        );
      } else if (status === 'declined' || status === 'rejected') {
        await createNotification(
          'driver',
          driverEmail,
          'fuel_declined',
          'Fuel Request Declined',
          `Your fuel request has been declined on ${date} at ${time}. Please contact the fuel manager for more information.`,
          {
            fuelId: fuel._id,
            vehicleNo: fuel.vehicleNo,
            date,
            time
          }
        );

        // Notify Dean about fuel decline
        await createNotification(
          'dean',
          null,
          'fuel_declined',
          'Fuel Request Declined',
          `Fuel request from ${fuel.dName} ${fuel.dlastName} (${fuel.vehicleNo}) was declined on ${date} at ${time}.`,
          {
            fuelId: fuel._id,
            driverName: `${fuel.dName} ${fuel.dlastName}`,
            vehicleNo: fuel.vehicleNo,
            date,
            time
          }
        );
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