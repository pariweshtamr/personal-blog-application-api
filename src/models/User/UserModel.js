import UserSchema from "./UserSchema.js"

export const getUserByFilter = (filter) => {
  return UserSchema.findOne(filter)
}

export const createUser = (obj) => {
  return UserSchema(obj).save()
}

export const getUserById = (_id) => {
  return UserSchema.findById(_id)
}

export const updateUser = (filter, obj) => {
  return UserSchema.findByIdAndUpdate(filter, obj, { new: true })
}
