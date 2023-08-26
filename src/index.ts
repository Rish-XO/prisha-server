import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();

// Base middlewares
app.use(cors());
app.use(express.json());

// Rest of your code...



