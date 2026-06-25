import { Router } from "express";
import { createGigController, getAllGigsController, getMyGigsController, getSingleGigController } from "./gigs.controller";


const router = Router();

router.post("/", createGigController);
router.get("/", getAllGigsController);
router.get("/:id", getSingleGigController);
router.get(
  "/my/:sellerId",
  getMyGigsController
);
export const createGigs= router;