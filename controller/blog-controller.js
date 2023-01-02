const { default: mongoose } = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");

const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (error) {
    return console.log(error);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No blog found" });
  }
  return res.status(200).json({ blogs });
};

const addBlogs = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    // existingUser = await User.findById(user);
    existingUser = req.user;
  } catch (error) {
    return console.log(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by this ID" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    // const session=await mongoose.startSession();
    // session.startTransaction();
    await blog.save();
    existingUser.blogs.push(blog);
    await existingUser.save();
    // await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ blog });
};

const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(id, {
      title,
      description,
    });
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to update the blog" });
  }
  return res.status(200).json({ blog });
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(404).json({ message: "No blog found" });
  }
  return res.status(200).json({ blog });
};

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user"); //if we dont use populate we have to pull using blog.id
    await blog.user.blogs.pull(blog); // because it shows only the id
    await blog.user.save();
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Successfully deleted" });
};

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No blog found" });
  }
  return res.status(200).json({ user: userBlogs });
};

module.exports = {
  getAllBlogs,
  addBlogs,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
};
