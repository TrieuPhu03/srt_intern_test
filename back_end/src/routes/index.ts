import { Router } from "express";
import todoRoutes from "../modules/todos/todo.route";

const router = Router();

router.use("/todos", todoRoutes);

export default router;
