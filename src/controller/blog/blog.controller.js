import Blog from "../../models/blog.js";
import User from "../../models/user.js";
import { uploadImage, deleteImage } from "../../utils/cloudinary.js";
import fs from "fs-extra";

// Post
export const postBlog = async (req, res) => {
  try {
    const { id_user, title, description, content } = req.body;

    if (!id_user || !title || !description || !content)
      res.status(400).json({ message: "the field is empty" });

    const newBlog = new Blog({
      id_user,
      title,
      description,
      content,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newBlog.image = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };

      fs.unlink(req.files.image.tempFilePath);
    }

    const blogSave = await newBlog.save();
    return res.status(201).json({ message: "Blog created: ", blogSave });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el blog" });
  }
};

// Get all
export const getAll = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("id_user", "username");

    const blogFilter = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      image: blog.image,
      user: blog.id_user ? blog.id_user.username : "Unknown",
      userId: blog.id_user._id,
      createdAt: blog.createdAt,
    }));

    const response = {
      blogs: blogFilter,
      total: blogFilter.length,
    };

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los blogs" });
  }
};

//Get by id
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("id_user")
      .populate({
        path: "comment",
        populate: {
          path: "id_user",
          model: "User",
          select: "_id username",
        },
      });

    const blogFilter = {
      _id: blog._id,
      user: {
        _id: blog.id_user._id,
        username: blog.id_user.username,
      },
      title: blog.title,
      description: blog.description,
      content: blog.content,
      image: blog.image,
      comment: blog.comment,
      createdAt: blog.createdAt,
    };

    if (!blog) return res.status(400).json({ message: "Blog is not found" });

    return res.status(200).json(blogFilter);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el blog" });
  }
};

//Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user, title, description, content } = req.body;
    const updateFields = {};

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (content) updateFields.content = content;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog)
      return res.status(400).json({ message: "Blog is not found" });

    if (existingBlog.id_user._id.toString() !== id_user) {
      return res.status(401).json({ message: "Not able to do" });
    }

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      updateFields.image = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };

      fs.unlink(req.files.image.tempFilePath);
    }

    Object.assign(existingBlog, updateFields);

    const updateBlog = await existingBlog.save();

    return res.status(200).json({ message: "Updated blog", updateBlog });
  } catch (error) {
    return res.status(500).json({ message: "Error al editar el blog" });
  }
};

//Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingBlog = await Blog.findById(id).populate("id_user");
    if (!existingBlog)
      return res.status(400).json({ message: "Blog is not found" });

    if (existingBlog.id_user._id.toString() !== userId) {
      return res.status(403).json({ message: "Not able to do" });
    }

    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog)
      return res.status(400).json({ message: "Blog is not founddd" });

    if (deleteBlog.image && deleteBlog.image.publicId) {
      await deleteImage(deleteBlog.image.publicId);
    }

    return res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el blog" });
  }
};

// COMMENT

//Post Comment
export const postComment = async (req, res) => {
  try {
    const { id_user, comment, blogId } = req.body;

    if (!id_user || !comment || !blogId)
      return res.status(400).json({ message: "The field is empty" });

    const userFound = await User.findById(id_user);
    if (!userFound)
      return res.status(400).json({ message: "User is not found" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = {
      id_user,
      comment,
    };

    blog.comment.push(newComment);
    await blog.save();

    return res.status(201).json({ message: "Comment created", blog });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el comentario" });
  }
};
