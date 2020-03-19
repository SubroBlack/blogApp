const Blog = require("./../models/blog");

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb
};
