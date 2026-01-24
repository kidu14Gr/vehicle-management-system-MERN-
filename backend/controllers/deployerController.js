const Deployer = require('../models/deployerModel');
const { createNotification } = require('./notificationController');
const User = require('../models/userModel');


const createDeployer = async (req, res) => {
  const { slat, slong, dlat, dlong, email, firstName, lastName,splace,dplace,km } = req.body;

  let emptyFields = [];

  if (!slat) {
    emptyFields.push('slat');
  }
  if (!slong) {
    emptyFields.push('slong');
  }
  if (!dlat) {
    emptyFields.push('dlat');
  }
  if (!dlong) {
    emptyFields.push('dlong');
  }
  if (!email) {
    emptyFields.push('email');
  }
  if (!firstName) {
    emptyFields.push('firstName');
  }
  if (!lastName) {
    emptyFields.push('lastName');
  }
  if (!splace) {
    emptyFields.push('lastName');
  }
  if (!dplace) {
    emptyFields.push('lastName');
  }
  if (!km) {
    emptyFields.push('lastName');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
  }

  // add to the database
  try {
    const deploy = await Deployer.create({
      slat,
      slong,
      dlat,
      dlong,
      email,
      firstName,
      lastName,
      splace,
      dplace,
      km,
      acknowledged: false
    });

    // Create notification for driver
    await createNotification(
      'driver',
      email,
      'mission_assigned',
      'New Mission Assigned',
      `You have a new mission from ${splace} to ${dplace}. Check details and request fuel if needed.`,
      {
        deployId: deploy._id,
        driverEmail: email,
        driverName: `${firstName} ${lastName}`,
        splace,
        dplace,
        km
      }
    );

    res.status(200).json(deploy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  const fetchDeployByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const deployer = await Deployer.findOne({ email });
      
      if (!deployer) {
        return res.status(404).json({ error: 'Deployer not found' });
      }
  
      res.status(200).json(deployer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const fetchAllDeploys = async (req, res) => {
    try {
      const deployers = await Deployer.find();
      res.status(200).json(deployers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const deleteDeployByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const deploy = await Deployer.findOneAndDelete({ email });
  
      if (!deploy) {
        return res.status(404).json({ error: 'Deploy not found' });
      }
  
      res.status(200).json({ message: 'Deploy successfully deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const acknowledgeMission = async (req, res) => {
    const { id } = req.params;
    const { driverEmail } = req.body;

    try {
      const deploy = await Deployer.findByIdAndUpdate(
        id,
        { acknowledged: true, acknowledgedAt: new Date() },
        { new: true }
      );

      if (!deploy) {
        return res.status(404).json({ error: 'Mission not found' });
      }

      // Get deployer info (the person who assigned the mission)
      // We need to find who created this deployment - for now, notify all vehicle deployers
      await createNotification(
        'vehicle deployer',
        null, // Notify all vehicle deployers
        'mission_acknowledged',
        'Mission Acknowledged',
        `${deploy.firstName} ${deploy.lastName} has acknowledged the mission from ${deploy.splace} to ${deploy.dplace}.`,
        {
          deployId: deploy._id,
          driverEmail: deploy.email,
          driverName: `${deploy.firstName} ${deploy.lastName}`,
          splace: deploy.splace,
          dplace: deploy.dplace
        }
      );

      res.status(200).json({ message: 'Mission acknowledged', deploy });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = { createDeployer, fetchDeployByEmail, fetchAllDeploys, deleteDeployByEmail, acknowledgeMission };


