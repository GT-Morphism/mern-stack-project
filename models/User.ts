import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
  role?: string[];
  active?: boolean;
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      type: String,
      default: "Employee",
    },
  ],
  active: {
    type: Boolean,
    default: "active",
  },
});

export default model("User", userSchema);
