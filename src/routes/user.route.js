import { Router } from "express";
import * as userController from "../controller/users/user.controller.js";

// Inicializar la funcion
const router = Router();

router.get("/users", userController.getAll);
router.get("/users/:id", userController.getById);
router.put("/users/put/:id", userController.updateUser);
router.delete("/users/delete/:id", userController.deleteUser);

export default router;
