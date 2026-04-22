const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: false, message: 'No token provided', data: [] });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ status: false, message: 'Invalid token', data: [] });
  }

  // Check if the account is currently suspended
  const suspendedUntil = await User.getSuspensionStatus(decoded.id);
  if (suspendedUntil) {
    const until = new Date(suspendedUntil).toUTCString();
    return res.status(403).json({
      status: false,
      message: `Your account has been suspended until ${until} due to a report filed against you.`,
      data: [{ suspended_until: suspendedUntil }]
    });
  }

  req.user = decoded;
  next();
};
