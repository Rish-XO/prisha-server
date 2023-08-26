if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import express from "express";
import cors from "cors";
import * as trcpExpress from "@trpc/server/adapters/express";
import { appRouter } from "./api";

const app = express();

// Base middlewares
app.use(cors());
app.use(express.json());

//sample
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(
  "/trpc",
  trcpExpress.createExpressMiddleware({
    router: appRouter,
  })
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
