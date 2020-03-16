const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  let sum = 0;
  blogs.forEach(blog => {
    sum = sum + blog.likes;
  });
  return sum;
};

const favoriteBlog = blogs => {
  let likes = 0;
  let result = {};
  blogs.forEach(blog => {
    if (blog.likes > likes) {
      likes = blog.likes;
      result = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      };
    }
  });
  return result;
};

const mostBlogs = blogs => {
  let mostBlogs = 0;
  let result = {};
  blogs.forEach(blog => {
    let author = blog.author;
    let currentAuthorBlogs = blogs.filter(blog => blog.author === author);
    if (currentAuthorBlogs.length > mostBlogs) {
      mostBlogs = currentAuthorBlogs.length;
    }
    result = {
      author: author,
      blogs: mostBlogs
    };
  });
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};
