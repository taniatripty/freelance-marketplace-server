import express from "express";
import { createReview, createWebsiteReview, getAllReviews, getBuyerReviews, getReviewsByGigController, getWebsiteReviews } from "./reviews.controller";

const router = express.Router();

router.post("/", createReview);
router.get("/gig/:gigId", getReviewsByGigController);
router.post("/website-reviews", createWebsiteReview);
router.get("/website-reviews", getWebsiteReviews);
router.get(
  "/buyer/:buyerId",
  getBuyerReviews
);

router.get("/admin", getAllReviews);
export const reviewsRoute= router;