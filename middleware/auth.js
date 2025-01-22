const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure the User model path is correct

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Decoded JWT in middleware:', decoded); // Debugging

      // Use `userId` from the token instead of `id`
      const user = await User.findById(decoded.userId).select('-password'); // Exclude password

      if (!user) {
        console.error('User not found with ID:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach user object to the request
      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};
