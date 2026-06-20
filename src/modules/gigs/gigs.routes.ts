import { Router } from "express";
import { createGigController, getAllGigsController, getSingleGigController } from "./gigs.controller";


const router = Router();

router.post("/", createGigController);
router.get("/", getAllGigsController);
router.get("/:id", getSingleGigController);
export const createGigs= router;