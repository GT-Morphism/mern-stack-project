import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/User";
import Note from "../models/Note";
import { Types } from "mongoose";

// @desc    Get all notes
// @route   GET /notes
// @access  Private
export const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    res.status(400);
    res.json({ message: "No notes found." });
    return;
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.userID).lean().exec();
      return { ...note, username: user?.username };
    })
  );

  res.json(notesWithUser);
});

// @desc    Create new note
// @route   POST /notes
// @access  Private
export const createNewNote = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      userID,
      title,
      text,
    }: {
      userID: string;
      title: string;
      text: string;
    } = req.body;

    if (!userID || !title || !text) {
      res.status(400);
      res.json({ message: "All fields are required." });
      return;
    }

    const duplicate = await Note.findOne({ title }).lean().exec();

    if (duplicate) {
      res.status(409);
      res.json({ message: "Duplicate note title." });
      return;
    }

    const newNote = await Note.create({ userID, title, text });

    if (newNote) {
      res.status(201);
      res.json({ message: "New note created." });
      return;
    } else {
      res.status(400);
      res.json({ message: "Invalid note data received." });
      return;
    }
  }
);

// @desc    Update note
// @routes  PUT /notes
// @access  Private
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const {
    id,
    userID,
    title,
    text,
    completed,
  }: {
    id: string;
    userID: string;
    title: string;
    text: string;
    completed: boolean;
  } = req.body;

  if (!id || !userID || !title || !text || typeof completed !== "boolean") {
    res.status(400);
    res.json({ message: "All fields are required." });
    return;
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    res.status(400);
    res.json({ message: "Note not found." });
    return;
  }

  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409);
    res.json({ message: "Duplicate note title." });
    return;
  }

  note.userID = new Types.ObjectId(userID);
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`<< ${updatedNote.title} >> updated.`);
});

// @desc    Delete note
// @routes  DELETE note
// @access  Private
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id }: { id: string } = req.body;

  if (!id) {
    res.status(400);
    res.json({ message: "Note ID required." });
    return;
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    res.status(400);
    res.json({ message: "Note not found." });
    return;
  }

  const deletedNote = await note.deleteOne();

  const reply = `Note << ${deletedNote.title} >> with ID ${deletedNote._id} deleted.`;

  res.json(reply);
});
