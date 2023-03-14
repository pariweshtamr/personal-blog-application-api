import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: 1,
    },
    password: {
      type: String,
      reequired: true,
      min: 7,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("User", UserSchema)
