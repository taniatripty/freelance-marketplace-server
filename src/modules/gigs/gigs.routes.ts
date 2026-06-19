import { Router } from "express";
import { createGigController } from "./gigs.controller";


const router = Router();

router.post("/", createGigController);

export const createGigs= router;