const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
        
      },
      lastName: {
        type: String,
        required: true
      },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pimages: {
    type: String, // Assuming the image field stores the filenames
    required: true
  },
  role: {
    type: String,
    required: true
  },
  drivertype: {
    type: String,
    required: false
  },
  vehicleNo: {
    type: String,
    required: false
  }
});

// Function to delete the uploaded file
const deleteUploadedFile = (filename) => {
  // Delete the file using your file handling mechanism
  // For example, if you're using the file system module:
  const fs = require('fs');
  const filePath = `uploads/pimages/${filename}`;
  fs.unlink(filePath, (error) => {
    if (error) {
      console.log('Error deleting file:', error);
    } else {
      console.log('File deleted successfully');
    }
  });
};

// static signup method
userSchema.statics.signup = async function (firstName, lastName, email, password, pimageFilename, role, drivertype, vehicleNo) {
    try {
      // Validation
      if (!firstName || !lastName || !email || !password || !role) {
        throw new Error('All fields must be filled');
      }
      if (!validator.isEmail(email)) {
        throw new Error('The email is not valid');
      }
      if (!validator.isStrongPassword(password)) {
        throw new Error('Password not strong enough');
      }
  
      const exists = await this.findOne({ email });
      if (exists) {
        throw new Error('Email already in use');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const user = await this.create({ 
        firstName, 
        lastName, 
        email, 
        password: hash, 
        pimages: pimageFilename || 'default-profile.png', 
        role, 
        drivertype, 
        vehicleNo 
      });
      return user;
    } catch (error) {
      if (pimageFilename && (
        error.message.includes('Email already in use') ||
        error.message.includes('The email is not valid') ||
        error.message.includes('Password not strong enough') ||
        error.message.includes('All fields must be filled')
      )) {
        deleteUploadedFile(pimageFilename);
      }
      throw error;
    }
  };

// static login method
userSchema.statics.login = async function (email, password, role) {
    if (!email || !password || !role) {
      throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    if (!user) {
      throw Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error('Incorrect password');
    }
    if (user.role !== role) {
      throw Error('User does not have the required role');
    }
    return user;
  };

  userSchema.statics.updateUser = async function (id, email, password, firstName, lastName, role, pimageFilename) {
    try {
      // Validation
      if (!email || !firstName || !lastName || !role) {
        throw new Error('All fields must be filled');
      }
      if (!validator.isEmail(email)) {
        throw new Error('The email is not valid');
      }

      const updateData = {
        email,
        firstName,
        lastName,
        role
      };

      if (password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error('Password not strong enough');
        }
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      if (pimageFilename) {
        updateData.pimages = pimageFilename;
      }
  
      const user = await this.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user;
    } catch (error) {
      if (pimageFilename && (
        error.message.includes('User not found') ||
        error.message.includes('The email is not valid') ||
        error.message.includes('Password not strong enough') ||
        error.message.includes('All fields must be filled')
      )) {
        deleteUploadedFile(pimageFilename);
      }
      throw error;
    }
  };

module.exports = mongoose.model('User', userSchema);