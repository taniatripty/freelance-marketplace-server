import express from "express";
import { getUserController, loginUser, registerUser } from "./auth.controller";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/:uid", getUserController);
export const AuthRoutes = router;