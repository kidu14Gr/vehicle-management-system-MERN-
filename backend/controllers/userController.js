const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const createToken = (_id) => {

    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '365d' });

}

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { email, password, firstName, lastName, role } = req.body;
  const pimage = req.file; // Get the uploaded profile image file

  try {
    const pimageFilename = pimage ? pimage.filename : null; // Extract the filename if available
    const user = await User.updateUser(id, email, password, firstName, lastName, role, pimageFilename); // Pass the additional fields to the updateUser function
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'No such user' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//login user
const loginUser = async (req,res) => {
    const {email , password, role} = req.body
    try {
        const user = await User.login(email , password, role)
        //create token
        const token = createToken(user._id)
        res.status(200).json({email,token})
        }
        catch (error) {
            res.status(400).json({error: error.message})
        }
}
//signup user
const signupUser = async (req, res) => {
    const { email, password, firstName, lastName, role, drivertype,vehicleNo } = req.body;
    const pimage = req.file; // Get the uploaded profile image file
  
    try {
      const pimageFilename = pimage ? pimage.filename : null; // Extract the filename if available
      const user = await User.signup(firstName, lastName, email, password, pimageFilename, role, drivertype,vehicleNo); // Pass the additional fields to the signup function
      // Create token
      const token = createToken(user._id);
      res.status(200).json({ email, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const deleteUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).json({ error: 'No such user' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getAllDriversno = async (req, res) => {
    try {
      const drivers = await User.find({ role: 'driver', vehicleNo: { $eq: '' } });
      res.status(200).json(drivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getAllDrivers = async (req, res) => {
    try {
    const drivers = await User.find({ role: 'driver' });
    res.status(200).json(drivers);
    } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
    };
  const updateUserVehicleNo = async (req, res) => {
    const { id } = req.params;
    const { vehicleNo } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(id, { vehicleNo }, { new: true });
  
      if (!user) {
        return res.status(404).json({ error: 'No such user' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user vehicle number:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {signupUser , loginUser , getUserByEmail, getAllUsers,  updateUserById, deleteUserById, getAllDrivers,getAllDriversno,updateUserVehicleNo}