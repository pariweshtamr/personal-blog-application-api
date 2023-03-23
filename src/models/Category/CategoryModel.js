import CategorySchema from "./CategorySchema.js"

export const createCategory = async (obj) => {
  return CategorySchema(obj).save()
}
