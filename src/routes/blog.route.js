import { Router } from "express";
import * as blogController from "../controller/blog/blog.controller.js";
import fileUpload from "express-fileupload";

// Inicializar la funcion
const router = Router();

router.post(
  "/create/blog",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  blogController.postBlog
);
router.get("/blogs", blogController.getAll);
router.get("/blogs/:id", blogController.getById);
router.put(
  "/update/blog/:id",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  blogController.updateBlog
);
router.delete("/blog/delete/:id", blogController.deleteBlog);

router.post("/blog/comment", blogController.postComment);

export default router;
