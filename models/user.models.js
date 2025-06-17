import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "username is required!"],
    },
    email: {
      type: String,
      require: [true, "email is required!"],
    },
    password: {
      type: String,
      require: [true, "password is required!"],
    },
    // blog: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Blog",
    //   },
    // ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
