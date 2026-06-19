import { Router } from "express";
import { createCategoryController } from "./categories.controller";
import { upload } from "../../middlewares/upload";


const router = Router();



router.post("/", createCategoryController);


export const CategoriesRoutes= router;