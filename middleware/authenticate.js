const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret123", async (err, user) => {
    if (err) return res.sendStatus(403);
    console.log(user.id);
    const userFound = await User.findOne({ _id: user.id });
    req.user = userFound;
    next();
  });
};

module.exports = auth;
