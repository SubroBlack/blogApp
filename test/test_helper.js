const Blog = require("./../models/blog");
const User = require("./../models/user");

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

const initialUsers = [
  {
    username: "test",
    name: "Million",
    password: "SEKRET"
  },
  {
    username: "admin",
    name: "Dollar",
    password: "SEKRET"
  }
];

// Function to return the Users in the test DB
const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb
};
