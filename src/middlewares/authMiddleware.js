import { verifyAccessJWT } from "../helpers/jwtHelper.js"
import { getUserById } from "../models/User/UserModel.js"

export const verifyUser = async (req, res, next) => {
  try {
    // get access jwt from headers
    const accessJWT = req.headers.authorization

    if (!accessJWT) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      })
    }

    // check validity
    const decoded = verifyAccessJWT(accessJWT)
    if (decoded === "jwt expired") {
      return res.status(403).json({
        status: "error",
        message: "jwt expired!",
      })
    }
    const user = await getUserById(decoded._id).select("-password")

    if (user?._id) {
      req.user = user
      return next()
    }
  } catch (error) {
    next(error)
  }
}
