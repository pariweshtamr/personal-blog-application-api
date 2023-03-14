import { verifyAccessJWT } from "../helpers/jwtHelper"
import { getUserById } from "../models/User/UserModel"

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

    if (user.email === "tamrpariwesh@gmail.com") {
      req.user = user
      return next()
    }
  } catch (error) {
    next(error)
  }
}
