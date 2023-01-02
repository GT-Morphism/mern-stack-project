import asyncHandler from "express-async-handler";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import Note from "../models/Note";

// @desc    Get all users
// @route   GET /users
// @access  Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    res.status(400);
    res.json({ message: "No users found." });
    return;
  }

  res.json(users);
});

// @desc    Create new user
// @route   POST /users
// @access  Private
export const createNewUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      username,
      password,
      roles,
    }: { username: string; password: string; roles: string[] } = req.body;

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
      res.status(400);
      res.json({ message: "All fields are required." });
      return;
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      res.status(409);
      res.json({ message: "Duplicate username" });
      return;
    }

    const hashedPwd = await hash(password, 10);

    const userObject = {
      username: username,
      password: hashedPwd,
      roles,
    };

    const user = await User.create(userObject);

    if (user) {
      res.status(201);
      res.json({ message: `New user ${username} created.` });
    } else {
      res.status(400);
      res.json({ message: "Invalid user data received." });
    }
  }
);

// @desc    Update user
// @route   PUT /users
// @access  Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    id,
    username,
    password,
    roles,
    active,
  }: {
    id: string;
    username: string;
    password?: string;
    roles: string[];
    active: boolean;
  } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res.status(400);
    res.json({ message: "All fields are required." });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400);
    res.json({ message: "User not found." });
    return;
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409);
    res.json({ message: "Duplicate username." });
    return;
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc    Delete user
// @route   DELETE /users
// @access  Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id }: { id: String } = req.body;

  if (!id) {
    res.status(400);
    res.json({ message: "User ID Required." });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400);
    res.json({ message: "User not found." });
    return;
  }

  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    res.status(400);
    res.json({ message: "User has assigned notes." });
    return;
  }

  const deletedUser = await user.deleteOne();

  const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted.`;

  res.json(reply);
});
