import express from "express";
import { becomeFreelancerController, getAllFreelancersController, getSingleFreelancerController } from "./profile.controller";


const router = express.Router();


router.post("/become-freelancer", becomeFreelancerController);
router.get("/", getAllFreelancersController);
router.get("/:id", getSingleFreelancerController);

export const profileRoutes= router;