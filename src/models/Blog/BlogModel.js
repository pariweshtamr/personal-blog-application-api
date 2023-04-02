import BlogSchema from "./BlogSchema.js"

export const getAllBlogs = () => {
  return BlogSchema.find()
}

export const getSingleBlog = (slug) => {
  return BlogSchema.findOne({ slug })
}

export const getBlogById = (id) => {
  return BlogSchema.findById(id)
}

export const getBlogsByFilter = (filter) => {
  return BlogSchema.find(filter)
}

export const createBlog = (obj) => {
  return BlogSchema(obj).save()
}

export const updateBlog = (filter, update) => {
  return BlogSchema.findOneAndUpdate(filter, update, { new: true })
}

export const deleteBlog = (_id) => {
  return BlogSchema.findByIdAndDelete(_id)
}
