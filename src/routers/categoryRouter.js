import express from "express"
import { verifyUser } from "../middlewares/authMiddleware.js"
import { createCategory } from "../models/Category/CategoryModel.js"

const router = express.Router()

router.post("/", verifyUser, async (req, res, next) => {
  try {
    const name = req.body.name.toLowerCase()

    const category = await createCategory({ name })

    category?._id
      ? res.json({
          status: "success",
          message: "Category created successfully!",
        })
      : res.json({ status: "error", message: "Unable to create category!" })
  } catch (error) {
    next(error)
  }
})

export default router
