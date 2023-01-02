import { Router } from "express";
import {
  createNewNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/notesController";

const noteRouter = Router();

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .put(updateNote)
  .delete(deleteNote);

export default noteRouter;
