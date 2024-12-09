import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
