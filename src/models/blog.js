import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    id_user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const blogSchema = new Schema(
  {
    id_user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    image: {
      publicId: {
        type: String,
      },
      secureUrl: {
        type: String,
      },
    },
    comment: [commentSchema],
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default model("Blog", blogSchema);
