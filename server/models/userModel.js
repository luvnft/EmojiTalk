import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    chat: [
      { type: Schema.Types.ObjectId, ref: "message", date: Date }, // comments 참조
      ,
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
