import express from "express"
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByFilter,
  getSingleBlog,
  updateBlog,
} from "../models/Blog/BlogModel.js"
import slugify from "slugify"
import DOMPurify from "isomorphic-dompurify"

const router = express.Router()

router.get("/getAll", async (req, res, next) => {
  try {
    const blogs = await getAllBlogs().populate("userId", "-password")
    return res.status(200).json({ status: "success", blogs })
  } catch (error) {
    next(error)
  }
})

router.get("/find/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params
    const blog = await getSingleBlog(slug).populate("userId", "-password")
    blog.views += 1
    blog.save()
    return res.status(200).json({ status: "success", blog })
  } catch (error) {
    next(error)
  }
})

router.get("/featured", async (req, res, next) => {
  try {
    const blogs = await getBlogsByFilter({ featured: true })
      .populate("userId", "-password")
      .limit(3)
    return res.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const { cleanContent } = req.body
    const content = DOMPurify.sanitize(cleanContent)
    const slug = slugify(req.body.title, { lower: true })
    const blog = await createBlog({
      ...req.body,
      content,
      userId: req.user._id,
      slug,
    })
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

router.put("/updateBlog/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params
    const { cleanContent, ...rest } = req.body
    const content = DOMPurify.sanitize(cleanContent)
    const blog = await getSingleBlog(slug)

    if (blog.userId.toString() !== req.user._id.toString()) {
      throw new Error("You can only update your blog posts!")
    }

    const updatedBlog = await updateBlog(
      { slug },
      {
        $set: { ...rest, content },
      }
    ).populate("userId", "-password")

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

router.delete("/deleteBlog/:_id", async (req, res, next) => {
  try {
    const blog = await getBlogById(req.params._id)

    if (blog.userId.toString() !== req.user._id.toString()) {
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
