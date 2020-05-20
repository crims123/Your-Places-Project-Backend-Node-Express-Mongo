const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  try {
    const verifyUser= jwt.verify(req.headers.authorization, process.env.SECRET);
    req.userLoggedId = verifyUser.user.id;
    next();
  } catch {
    res.status(404).json({
      success: false,
      message: 'Invalid json web token',
    });
  }
};

module.exports = verifyAuth;
