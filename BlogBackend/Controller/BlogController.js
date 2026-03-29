const Blog = require("../Modal/BlogSchema");
const User = require("../Modal/UserSchema");

exports.blogCreate = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    const blog = await Blog.create({ title, description, user });

    await User.findByIdAndUpdate(user, { $push: { blog: blog._id } });

    if (blog) {
      return res.status(200).json({
        success: true,
        message: "Blog created successfully",
        blog: blog,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Blog not created",
        blog: blog,
      });
    }
  } catch (error) {
    console.log(error, "Error creating Blog");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate({
      path: "user", // Populate the user of the blog
      // populate: {
      //     path: 'blog',  // Populate the 'blog' array inside the user document
      //     model: 'Blog'

      // }
    })
    return res.status(200).json(blogs);
  } catch (error) {
    console.log(error, "Error getting Blog");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate({
      path: "user",
      model: "User",
      // populate: {
      //     path: 'blog',
      //     model: 'Blog'
      // }
    })
    if (blog) {
      return res.status(200).json({
        success: true,
        message: "Blog found successfully",
        blog,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
        blog,
      });
    }
  } catch (error) {
    console.log(error, "Error getting Single Blog");
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description } = req.body;
    const updateBlog = await Blog.findByIdAndUpdate(blogId,
      { title, description },
      { new: true });
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updateBlog,
    });
  } catch (error) {
    console.log(error, "Error updating Blog");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      blog: deleteBlog,
    });
  } catch (error) {
    console.log(error, "Error deleting Blog");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
