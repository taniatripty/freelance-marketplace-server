import express from "express";
import { createReview, getReviewsByGigController } from "./reviews.controller";

const router = express.Router();

router.post("/", createReview);
router.get("/gig/:gigId", getReviewsByGigController);
export const reviewsRoute= router;