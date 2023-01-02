import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "mongoose";
import { logger, logEvents } from "../middleware/logger";
import errorHandler from "../middleware/errorHandler";
import corsOptions from "../config/corsOptions";
import connectDB from "../config/dbConn";
import root from "../routes/root";
import userRouter from "../routes/userRoutes";
import noteRouter from "../routes/noteRoutes";

const app = express();
const PORT = process.env.PORT || 5555;

console.log(`Currently in ${process.env.NODE_ENV} mode`);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.use("/", root);
app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
});

connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
