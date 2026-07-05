import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { todoController } from "./todo.controller";
import {
  createTodoSchema,
  idParamSchema,
  listTodoQuerySchema,
  updateTodoSchema,
} from "./todo.schema";

const router = Router();

router.get("/", validate(listTodoQuerySchema), todoController.list);
router.get("/:id", validate(idParamSchema), todoController.getById);
router.post("/", validate(createTodoSchema), todoController.create);
router.patch("/:id", validate(updateTodoSchema), todoController.update);
router.patch("/:id/toggle", validate(idParamSchema), todoController.toggleStatus);
router.delete("/:id", validate(idParamSchema), todoController.remove);

export default router;
