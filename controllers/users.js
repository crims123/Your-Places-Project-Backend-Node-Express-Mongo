const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const userCtrl = {};
const User = require('../models/User');

userCtrl.addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const uniqueEmail = await User.findOne({ email });
    if (uniqueEmail) {
      return res.status(403).json({
        success: false,
        message: 'Email has already been registered',
      });
    }

    const user = new User({
      name,
      email,
      password,
      image: 'imagetest',
      places: [],
    });

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    // Create Token
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        res.json({
          success: true,
          message: 'User created',
          data: {
            token,
            userId: user._id,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logging in failed, please try again later.',
    });
  }
};

userCtrl.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Incorrect Email',
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(403).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        res.json({
          success: true,
          message: 'User Authenticated',
          data: {
            token,
            userId: user._id,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logging in failed, please try again later.',
    });
  }
};

userCtrl.getUsers = async (req, res) => {
  try {
    users = await User.find({}, '-password');
    res.json({
      success: true,
      message: 'Users',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Fetching users failed, please try again later.',
    });
  }
};

module.exports = userCtrl;
