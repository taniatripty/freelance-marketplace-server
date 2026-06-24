

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { profileRoutes } from "./modules/profile/profile.routes";
import { CategoriesRoutes } from "./modules/categories/categories.routes";
import { createGigs } from "./modules/gigs/gigs.routes";
import { createOrders } from "./modules/oders/order.routes";
import { messageRoutes } from "./modules/message/messaga.routes";
import { notificationRoutes } from "./modules/notification/notification.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { reviewsRoute } from "./modules/reviews/reviews.routes";

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
app.use("/chat",messageRoutes)
app.use("/notifications",notificationRoutes)
app.use("/payments",paymentRoutes)
app.use("/reviews", reviewsRoute);
export default app;