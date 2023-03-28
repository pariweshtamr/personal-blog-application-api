import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      index: 1,
      deafult: "",
    },
    read: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      deafult: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Blog", BlogSchema)
