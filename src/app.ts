

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { profileRoutes } from "./modules/profile/profile.routes";
import { CategoriesRoutes } from "./modules/categories/categories.routes";
import { createGigs } from "./modules/gigs/gigs.routes";
import { createOrders } from "./modules/oders/order.routes";

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
app.use("/freelancer", profileRoutes)
app.use("/categories",CategoriesRoutes)
app.use("/gigs", createGigs)
app.use("/orders", createOrders)
export default app;