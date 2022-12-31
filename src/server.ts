import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "../middleware/logger";
import errorHandler from "../middleware/errorHandler";
import corsOptions from "../config/corsOptions";
import root from "../routes/root";

const app = express();
const PORT = process.env.PORT || 5555;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.use("/", root);

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

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
