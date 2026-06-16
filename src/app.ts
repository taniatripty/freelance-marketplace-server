

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./modules/auth/auth.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
app.use("/auth", AuthRoutes)

export default app;