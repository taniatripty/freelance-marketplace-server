import { Router } from "express";
import { createGigController, deleteGig, getAllActiveGigsController,  getAllGigs,  getMyGigsController, getSingleGigController, updateGig, updateGigStatus } from "./gigs.controller";


const router = Router();

router.post("/", createGigController);
router.get("/all", getAllGigs);
router.get("/", getAllActiveGigsController);
router.get("/:id", getSingleGigController);
router.get("/my/:sellerId",getMyGigsController);
router.put("/update/:id", updateGig);
router.delete("/delete/:id", deleteGig);
router.patch("/:id/status", updateGigStatus);
export const createGigs= router;