import { Router } from "express";

const router = Router();

router.get("/api/todos", getTodos);
router.get("/api/todo/:id", getTodo);
router.post("/api/add-todo", addTodo);
router.put("/api/update-todo/:id", updateTodo);
router.delete("/api/remove-todo/:id", removeTodo);

export default router;
