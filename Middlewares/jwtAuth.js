const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:");
    return res.status(403).json({ error: err });
  }
};

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 30 });
};

module.exports = { jwtAuth, generateToken };
