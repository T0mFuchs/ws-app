import mongoose from "mongoose";

export const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: String,
  clr: String,
  tags: [
    {
      name: String,
      clr: String,
    },
  ],
  content: [
    {
      style: String,
      value: String,
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "page",
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
    },
  ],
  iat: {
    type: Number,
    required: true,
  },
  eat: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.page || mongoose.model("page", pageSchema);
