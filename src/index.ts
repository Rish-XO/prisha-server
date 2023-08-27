if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import express, { Request, Response, Express } from "express";
import cors from "cors";
import * as trcpExpress from "@trpc/server/adapters/express";
import { appRouter } from "./api";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import pool from "./db";

const app = express();

// Base middlewares
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueFilename = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

//sample
app.get("/", (req, res) => {
  res.send("Hello world");
});

// trpc routes
app.use(
  "/trpc",
  trcpExpress.createExpressMiddleware({
    router: appRouter,
  })
);

//image upload
app.post("/upload-image", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const { filename, originalname } = file;
    console.log(filename, originalname);
    res.status(200).json(filename);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

//pdf upload
app.post("/upload-pdf", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const { filename, originalname } = file;
    console.log(filename, originalname);

    res.status(200).json(filename);
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ error: "Error uploading PDF" });
  }
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
