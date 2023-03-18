import express from "express"
import { verifyUser } from "../middlewares/authMiddleware.js"
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogsByFilter,
  getSingleBlog,
  updateBlog,
} from "../models/Blog/BlogModel.js"

const router = express.Router()

router.get("/getAll", async (req, res, next) => {
  try {
    const blogs = await getAllBlogs().populate("userId", "-password")
    return res.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

router.get("/find/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params
    const blog = await getSingleBlog(_id).populate("userId", "-password")
    blog.views += 1
    blog.save()
    return res.status(200).json(blog)
  } catch (error) {
    next(error)
  }
})

router.get("/featured", async (req, res, next) => {
  try {
    const blogs = await getBlogsByFilter({ featured: true }).populate(
      "userId",
      "-password"
    )
    return res.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post("/", verifyUser, async (req, res, next) => {
  try {
    const blog = await createBlog({ ...req.body, userId: req.user._id })
    if (!blog?._id) {
      return res.json({
        status: "error",
        message: "Unable to create blog post!",
      })
    }
    res.json({
      status: "success",
      message: "Blog post has been created!",
      blog,
    })
  } catch (error) {
    next(error)
  }
})

router.put("/updateBlog/:_id", verifyUser, async (req, res, next) => {
  try {
    const blog = await getSingleBlog(req.params._id)
    if (blog.userId !== req.user._id) {
      throw new Error("You can only update your blog posts!")
    }

    const updateBlog = await updateBlog(req.params._id, {
      $set: req.body,
    }).populate("userId", "-password")

    return res.json({
      status: "success",
      message: "Blog post updated successfully!",
      updatedBlog,
    })
  } catch (error) {
    next(error)
  }
})

router.put("/likeBlog", async (req, res, next) => {
  try {
    const blog = await getSingleBlog(req.params._id)
    blog.likes += 1
    blog.save()
  } catch (error) {
    next(error)
  }
})

router.delete("/deleteBlog/:_id", verifyUser, async (req, res, next) => {
  try {
    const blog = await getSingleBlog(req.params._id)
    if (blog.userId !== req.user._id) {
      throw new Error("You are not authorized to delete this blog post!")
    }
    const delBlog = await deleteBlog(req.params._id)

    if (!delBlog?._id) {
      return res.json({
        status: "error",
        message: "Unable to delete blog post!",
      })
    }
    res.json({
      status: "success",
      message: "Blog post deleted successfully!",
    })
  } catch (error) {
    next(error)
  }
})

export default router
