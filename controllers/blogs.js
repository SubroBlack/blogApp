const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  const body = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes ? request.body.likes : 0
  };
  const newBlog = new Blog(body);
  const result = await newBlog.save();
  response.status(201).json(result.toJSON());
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
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
