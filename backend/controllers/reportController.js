const Report = require('../models/reportModel');
const { createNotification } = require('./notificationController');
const User = require('../models/userModel');
const Deployer = require('../models/deployerModel');

const createReport = async (req, res) => {
    try {
      const { firstName, lastName, vehicleNo, km, litre,destStatus,splace,dplace } = req.body;
  
      // Create a new report object
      const report = new Report({
        firstName,
        lastName,
        vehicleNo,
        km,
        litre,
        destStatus,
        splace,
        dplace
      });
  
      // Save the report to the database
      const savedReport = await report.save();

      // Get driver info
      const driver = await User.findOne({ vehicleNo, role: 'driver' });
      const driverEmail = driver ? driver.email : null;
      const driverName = `${firstName} ${lastName}`;
      const date = new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      });

      // Notify Vehicle Deployer
      await createNotification(
        'vehicle deployer',
        null,
        'mission_completed',
        'Mission Completed',
        `${driverName} has completed the mission from ${splace} to ${dplace} on ${date}.`,
        {
          reportId: savedReport._id,
          driverName,
          driverEmail,
          vehicleNo,
          km,
          litre,
          splace,
          dplace,
          date
        }
      );

      // Notify Fuel Manager
      await createNotification(
        'fuel manager',
        null,
        'mission_completed',
        'Mission Completed',
        `${driverName} has completed a mission on ${date}. Fuel consumption: ${litre} liters for ${km} km.`,
        {
          reportId: savedReport._id,
          driverName,
          vehicleNo,
          km,
          litre,
          date
        }
      );

      // Notify Dean
      await createNotification(
        'dean',
        null,
        'mission_completed',
        'Mission Completed',
        `${driverName} completed a mission from ${splace} to ${dplace} on ${date}.`,
        {
          reportId: savedReport._id,
          driverName,
          vehicleNo,
          km,
          litre,
          splace,
          dplace,
          date
        }
      );

      // Also notify when fuel is approved (if status is successed)
      if (destStatus === 'successed') {
        await createNotification(
          'driver',
          driverEmail,
          'fuel_approved',
          'Fuel Request Approved',
          `Your fuel request has been approved. Mission completed successfully.`,
          {
            reportId: savedReport._id,
            vehicleNo,
            litre
          }
        );
      }
  
      res.status(201).json(savedReport);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the report' });
    }
  };

  const updateDestStatus = async (req, res) => {
    try {
      const { reportId } = req.params; // Assuming the reportId is passed as a parameter in the URL
      const { destStatus } = req.body;
  
      // Find the report by its ID
      const report = await Report.findById(reportId);
  
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
  
      // Update the destStatus field
      report.destStatus = destStatus;
  
      // Save the updated report
      const updatedReport = await report.save();
  
      res.json(updatedReport);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the destStatus' });
    }
  };

  const getAllReports = async (req, res) => {
    try {
      // Retrieve all report documents from the database in reverse order
      const reports = await Report.find().sort({ createdAt: -1 });
  
      // Send the retrieved documents as a response
      res.json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching all reports' });
    }
  };

  const getReportsByVehicleNo = async (req, res) => {
    try {
      const { vehicleNo } = req.params; // Assuming the vehicle number is passed as a parameter in the URL
  
      // Retrieve reports with the matching vehicle number from the database in reverse order
      const reports = await Report.find({ vehicleNo }).sort({ createdAt: -1 });
  
      // Send the retrieved reports as a response
      res.json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching reports by vehicle number' });
    }
  };
module.exports = {createReport,updateDestStatus,getAllReports,getReportsByVehicleNo };
