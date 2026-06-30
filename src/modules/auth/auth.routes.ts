import express from "express";
import { getAllUsers, getUserController, loginUser,  registerUser, updateProfile, updateUserRole } from "./auth.controller";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users",getAllUsers)
router.patch("/users/:uid/role",updateUserRole);
router.get("/users/:uid", getUserController);
router.patch("/users/:uid", updateProfile);
export const AuthRoutes = router;