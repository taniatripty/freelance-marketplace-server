import express from "express";
import { createReview, createWebsiteReview, getBuyerReviews, getReviewsByGigController, getWebsiteReviews } from "./reviews.controller";

const router = express.Router();

router.post("/", createReview);
router.get("/gig/:gigId", getReviewsByGigController);
router.post("/website-reviews", createWebsiteReview);
router.get("/website-reviews", getWebsiteReviews);
router.get(
  "/buyer/:buyerId",
  getBuyerReviews
);
export const reviewsRoute= router;