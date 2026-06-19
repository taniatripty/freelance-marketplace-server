import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../confing/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "categories",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  } as any,
});

export const upload = multer({ storage });