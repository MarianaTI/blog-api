import { Router } from "express";
import * as authController from "../controller/authetication/login.controller.js";
import { verifyDuplicateEmail } from "../middleware/verifySignUp.js";

// Inicializar la funcion
const router = Router();

router.post("/signup", authController.SignUp);
router.post("/signin", authController.SignIn);

export default router;

