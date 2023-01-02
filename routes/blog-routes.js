const express = require("express");
const {
  getAllBlogs,
  addBlogs,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
} = require("../controller/blog-controller");
const auth = require("../middleware/authenticate");
const blogRouter = express.Router();

blogRouter.get("/", auth, getAllBlogs);
blogRouter.post("/add", auth, addBlogs);
blogRouter.put("/update/:id", auth, updateBlog);
blogRouter.get("/:id", auth, getById);
blogRouter.delete("/:id", auth, deleteBlog);
blogRouter.get("/user/:id", auth, getByUserId);

module.exports = blogRouter;
