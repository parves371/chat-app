import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    contant: {
      type: String,
    },
    attachment: [
      {
        public_id: {
          type: String,
          required: true,
        },
        URL: {
          type: String,
          required: true,
        },
      },
    ],
  }, 
  {
    timestamps: true,
  }
);

export const Message = models.Massage || model("Message", messageSchema);
