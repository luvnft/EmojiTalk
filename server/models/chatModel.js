import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    userName: { type: String, date: Date },
    message: { type: String, date: Date },
    emoji: { type: String, date: Date },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
