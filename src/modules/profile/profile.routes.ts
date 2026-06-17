import express from "express";
import { becomeFreelancerController } from "./profile.controller";


const router = express.Router();

// POST /api/freelancer/become
router.post("/become-freelancer", becomeFreelancerController);

export const profileRoutes= router;