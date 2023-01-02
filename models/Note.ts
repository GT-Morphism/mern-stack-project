import mongoose from "mongoose";
import Inc from "mongoose-sequence";

interface Note {
  userID: mongoose.Types.ObjectId;
  title: string;
  text: string;
  completed?: boolean;
}

const noteSchema = new mongoose.Schema<Note>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// @ts-ignore
const AutoIncrement = Inc(mongoose);

// @ts-ignore
noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

export default mongoose.model("Note", noteSchema);
