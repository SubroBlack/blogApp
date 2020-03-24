const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();

blogsRouter.get("/", async (request, response) => {
  blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes ? request.body.likes : 0,
    user: user._id
  });
  const result = await newBlog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result.toJSON());
});

blogsRouter.delete("/:id", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const blog = await Blog.findById(request.params.id);
  const user = await User.findById(decodedToken.id);

  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id);
    user.blogs = user.blogs.filter(blog => blog !== request.params.id);
    await user.save();
    return response.status(204).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  blogToUpdate = {
    likes: request.body.likes
  };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogToUpdate,
    { new: true }
  );
  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
