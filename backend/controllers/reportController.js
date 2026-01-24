const Report = require('../models/reportModel'); // Assuming the model file is in the "../models" directory

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
