import express from "express"
import { comparePassword, hashPassword } from "../helpers/bcryptHelper.js"
import { createJwts } from "../helpers/jwtHelper.js"
import { verifyUser } from "../middlewares/authMiddleware.js"
import { createUser, getUserByFilter } from "../models/User/UserModel.js"

const router = express.Router()

// get user
router.get("/", verifyUser, async (req, res, next) => {
  try {
    const user = req.user

    const { __v, ...others } = user._doc

    res.json({
      status: "success",
      message: "User Found!",
      user: others,
    })
  } catch (error) {
    next(error)
  }
})

// register user
router.post("/register", async (req, res, next) => {
  const { email, password } = req.body
  try {
    const existingUser = await getUserByFilter({ email })
    if (existingUser?._id) {
      return res.json({
        status: "error",
        mesage: "An account with this email already exists. Please log in!",
      })
    }

    // hash password
    const hashPass = hashPassword(password)
    req.body.password = hashPass

    const newUser = await createUser(req.body)
    if (newUser?._id) {
      return res.status(200).json({
        status: "success",
        message: "User has been created successfully!",
      })
    }
    return res.json({
      status: "error",
      message: "Unable to create user. Please try again later!",
    })
  } catch (error) {
    next(error)
  }
})

// login user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await getUserByFilter({ email })
    if (!user?._id) {
      return res.json({
        status: "error",
        message: "User not found!",
      })
    }

    // compare password
    const isPassMatched = comparePassword(password, user.password)

    if (!isPassMatched) {
      return res.json({
        status: "error",
        message: "Invalid login details!",
      })
    }

    user.password = undefined
    user.__v = undefined
    user.refreshJwt = undefined

    const tokens = await createJwts({ _id: user._id })
    return res.status(200).json({
      status: "success",
      message: "Login Successful",
      tokens,
      user,
    })
  } catch (error) {
    next(error)
  }
})

export default router
