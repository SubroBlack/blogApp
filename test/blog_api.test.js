const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const testHelper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = testHelper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test("Blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Correct number of Blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body.length).toBe(testHelper.initialBlogs.length);
});

test("id is unique identifier in the DB", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  expect(blogs[0].id).toBeDefined();
});

/*
test("ID is unique", async () => {
  const response = await api.get("/api/blogs");
  console.log(response.body);
  const ids = response.body.map(blog => blog._id.toString());
  console.log(ids);
  const firstId = ids[0];
  const remainingIds = ids.filter(id => {
    id !== firstId;
  });
  expect(remainingIds).not.toContain(firstId);
});
*/

test("HTTP POST creates new blog", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Developer",
    url: "https://abc.com",
    likes: 1234
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testHelper.blogsInDb();
  expect(blogsAtEnd.length).toBe(testHelper.initialBlogs.length + 1);

  const addedBlog = blogsAtEnd[testHelper.initialBlogs.length];
  expect(addedBlog.title).toBe(newBlog.title);
});

test("Default amount of likes for blogs is 0", async () => {
  const newBlog = {
    title: "Zero Likes Blog",
    author: "Developer",
    url: "https://abc.com"
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testHelper.blogsInDb();

  const addedBlog = blogsAtEnd[testHelper.initialBlogs.length];
  expect(addedBlog.likes).toBe(0);
});

test("Empty Title and URL fails with status code 400", async () => {
  const newBlog = {
    author: "Developer",
    likes: 2
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);
});

test("A single Post can be deleted using Id", async () => {
  const blogToBeDeleted = {
    title: "TO be deleted",
    author: "abc",
    url: "abc"
  };
  await api
    .post("/api/blogs")
    .send(blogToBeDeleted)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testHelper.blogsInDb();

  const addedBlogId = blogsAtEnd[testHelper.initialBlogs.length].id;

  await api.delete(`/api/blogs/${addedBlogId}`).expect(204);
});

test("A single Post likes can be Updated using Id", async () => {
  const newBlog = {
    title: "TO be Changed",
    author: "abc",
    url: "abc"
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testHelper.blogsInDb();

  const addedBlogId = blogsAtEnd[testHelper.initialBlogs.length].id;
  const updateBlog = {
    likes: 1000
  };

  const updated = await api.put(`/api/blogs/${addedBlogId}`).send(updateBlog);

  expect(updated.body.likes).toBe(1000);
});

afterAll(() => {
  mongoose.connection.close();
});
