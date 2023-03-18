import BlogSchema from "./BlogSchema.js"

export const getAllBlogs = () => {
  return BlogSchema.find()
}

export const getSingleBlog = (_id) => {
  return BlogSchema.findById(_id)
}

export const getBlogsByFilter = (filter) => {
  return BlogSchema.find(filter)
}

export const createBlog = (obj) => {
  return BlogSchema(obj).save()
}

export const updateBlog = (_id, update) => {
  return BlogSchema.findByIdAndUpdate(_id, update, { new: true })
}

export const deleteBlog = (_id) => {
  return BlogSchema.findByIdAndDelete(_id)
}
