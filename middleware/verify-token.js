const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('TOKEN:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED:', decoded);

    req.user = decoded.payload;

    next();
  } catch (err) {
    console.error('VERIFY TOKEN ERROR:', err.message);
    res.status(401).json({ err: 'Invalid Token' });
  }
};

module.exports = verifyToken;
