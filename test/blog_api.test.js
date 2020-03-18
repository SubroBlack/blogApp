const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Industrial Society and its future",
    author: "Theodore J. Kaczynski",
    url: "http://editions-hache.com/essais/pdf/kaczynski2.pdf",
    likes: 350000
  },
  {
    title: "Me and Bobby McGee",
    author: "Janis Joplin",
    url: "https://www.youtube.com/watch?v=WXV_QjenbDw",
    likes: 164000
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map(blog => new Blog(blog));
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

  expect(response.body.length).toBe(initialBlogs.length);
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

  const result = await api.get("/api/blogs");
  const blogsAtEnd = result.body;
  expect(blogsAtEnd.length).toBe(initialBlogs.length + 1);

  const addedBlog = blogsAtEnd[initialBlogs.length];
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

  const result = await api.get("/api/blogs");
  const blogsAtEnd = result.body;

  const addedBlog = blogsAtEnd[initialBlogs.length];
  expect(addedBlog.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
