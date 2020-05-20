const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const userCtrl = {};
const User = require('../models/User');

userCtrl.addUser = async (req, res) => {
  try {
    const { name, email, password, register } = req.body;

    const uniqueEmail = await User.findOne({ email });

    if (uniqueEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email has already been registered',
      });
    }

    const user = new User({
      name,
      email,
      password,
      register,
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
          data: { token },
        });
      }
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

userCtrl.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect Email',
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
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
          data: { token },
        });
      }
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

userCtrl.getUser = async (req, res) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.headers.authorization, process.env.SECRET);
    const user = await User.findById(id).select('-password');

    res.json({
      success: true,
      message: 'User Data',
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

module.exports = userCtrl;
