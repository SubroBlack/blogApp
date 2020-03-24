const Blog = require("./../models/blog");
const User = require("./../models/user");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");

const api = supertest(app);

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

// Function to return the Blogs in the test DB
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

// Function to return the Users in the test DB
const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

// Function to return loggedIn token
const tokenProducer = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("SEKRET", 10);
  const user = new User({ username: "test", name: "test", passwordHash });

  await user.save();

  const testUser = { username: "test", password: "SEKRET" };

  const login = await api.post("/api/login").send(testUser);
  const token = `bearer ${login.body.token}`;
  return token;
};

module.exports = {
  initialBlogs,
  tokenProducer,
  blogsInDb,
  usersInDb
};
