import express, { Request, Response } from "express";
import path from "path";

const root = express.Router();

root.get("^/$|/index(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default root;
