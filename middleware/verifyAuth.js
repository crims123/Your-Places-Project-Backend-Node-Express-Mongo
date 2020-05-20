const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, process.env.SECRET);
    next();
  } catch {
    res.status(404).json({
      success: false,
      message: 'Invalid json web token',
    });
  }
};

module.exports = verifyAuth;
