const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.payload;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ err: 'Invalid Token' });
  }
};

module.exports = verifyToken;
