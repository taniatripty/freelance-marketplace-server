import { Router } from "express";
import { createCategoryController, getAllCategoriesController } from "./categories.controller";
import { upload } from "../../middlewares/upload";


const router = Router();



router.post("/", createCategoryController);

router.get("/", getAllCategoriesController);
export const CategoriesRoutes= router;