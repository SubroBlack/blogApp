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

afterAll(() => {
  mongoose.connection.close();
});
