import mongoose from "mongoose";

export const pageSchema = new mongoose.Schema({
  i: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  desc: String,
  clr: String,
  tags: [
    {
      i: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      clr: String,
    },
  ],
  content: [
    {
      i: {
        type: Number,
        required: true,
      },
      style: {
        type: String,
        required: true,
      },
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
