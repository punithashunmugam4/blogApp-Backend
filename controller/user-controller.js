const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res, next) => {
  let users;
  try {
    // populate is used to get all data from other document which is referred here
    // users=await User.find().populate('blogs');
    // otherwise it only shows the id
    users = await User.find();
  } catch (error) {
    console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "No User Found" });
  }
  return res.status(200).json({ users });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login instead", existingUser });
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });
  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res.status(201).json({ user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  if (existingUser) {
    let passwordCorrect = await bcrypt.compare(password, existingUser.password);
    if (passwordCorrect) {
      const accessToken = jwt.sign({ id: existingUser._id }, "secret123", {
        expiresIn: "1000000s",
      });
      // console.log(accessToken);
      return res.status(200).json({
        message: "Login Successfull",
        user: existingUser,
        token: accessToken,
      });
    } else return res.status(401).json({ message: "Password Incorrect" });
  }
  return res
    .status(404)
    .json({ message: "Email does not exist, Please SignUp" });
};

module.exports = { getAllUser, signUp, login };
