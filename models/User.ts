import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
  roles?: string[];
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
  roles: [
    {
      type: String,
      default: "Employee",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

export default model("User", userSchema);
