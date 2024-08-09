import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: "https://keen-duckanoo-eb6256.netlify.app",
    credentials: true,
  })
);

// remove it in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;
