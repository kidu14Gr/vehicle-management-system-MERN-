const Deployer = require('../models/deployerModel');


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
      km
    });
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
module.exports = { createDeployer,fetchDeployByEmail,fetchAllDeploys,deleteDeployByEmail };


