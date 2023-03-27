import CategorySchema from "./CategorySchema.js"

export const createCategory = async (obj) => {
  return CategorySchema(obj).save()
}

export const getCategories = async () => {
  return CategorySchema.find()
}
