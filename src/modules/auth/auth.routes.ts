import express from "express";
import { getUserController, loginUser, registerUser, updateProfile } from "./auth.controller";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/:uid", getUserController);
router.patch("/users/:uid", updateProfile);
export const AuthRoutes = router;