import jwt from "jsonwebtoken"
import { updateUser } from "../models/User/UserModel.js"

export const signAccessJWT = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "30m",
  })
  return accessJWT
}

export const signRefreshJWT = async (payload) => {
  const refreshJwt = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  })

  await updateUser({ _id: payload._id }, { refreshJwt })

  return refreshJwt
}

export const createJwts = async (payload) => {
  return {
    accessJwt: await signAccessJWT(payload),
    refreshJwt: await signRefreshJWT(payload),
  }
}

export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY)
  } catch (error) {
    return error.message
  }
}

export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY)
  } catch (error) {
    return error.message
  }
}
