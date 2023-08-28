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
import path from 'path'


const app = express();

// Base middlewares
app.use(cors());
app.use(express.json());
app.use("/server/uploads", express.static(path.join(__dirname,'..', "uploads")));

//multer config
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
    const { filename } = file;
    // console.log(filename," the file name");
    const fileUrl = `http://localhost:${port}/server/uploads/${filename}`;
    // console.log(fileUrl," the file url");
    res.status(200).json(fileUrl);
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

    const { filename } = file;
    
    // console.log(filename," the file name");
    const fileUrl = `http://localhost:${port}/server/uploads/${filename}`;
    // console.log(fileUrl," the file url");
    res.status(200).json(fileUrl);

  } catch (error) {
    console.error("Error uploading PDF:", error); 
    res.status(500).json({ error: "Error uploading PDF" });
  }
});

// app.get("/get-image/:id", async (req, res) => {
//   try {
//     const imageId = req.params.id;

//     // Retrieve image information from the database
//     const getImageQuery = "SELECT image FROM books WHERE book_id = $1";
//     const imageResult = await pool.query(getImageQuery, [imageId]);

//     if (imageResult.rows.length === 0) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     const { image } = imageResult.rows[0];

//     // Serve the image using the filename
//     res.sendFile(path.join(__dirname,"..", "uploads", image));
//   } catch (error) {
//     console.error("Error retrieving image:", error);
//     res.status(500).json({ error: "Error retrieving image" });
//   }
// })

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
