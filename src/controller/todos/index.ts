import { Request, Response } from "express";

import TodoModel from "../../models/todo";
import { Todo } from "../../types/todo";

export const getTodos = async (req: Request, res: Response) => {
  const todos: Todo[] = await TodoModel.find();

  res.status(200).json({ todos });
};

export const getTodo = async (req: Request, res: Response) => {
  await TodoModel.findById(req.params.id, (err, result) => {
    err
      ? res.status(400).json({ error: err })
      : res.status(200).json({ result });
  });
};

export const addTodo = async (req: Request, res: Response): Promise<void> => {
  const body: Pick<Todo, "title" | "status"> = req.body;

  if (!body.title || !body.status) {
    res.status(401).json({
      status: 401,
      errorMessage: `Validation Error: Todo validation failed: title: ${body.title}, status: ${body.status}`,
    });

    return;
  }

  const newTodoModel = new TodoModel({
    title: body.title,
    status: body.status,
  });

  const newTodo = await newTodoModel.save();
  const updatedAllTodosAfterSave = await TodoModel.find();

  res.status(201).json({
    message: "Todo Successfully added!",
    addedTodo: newTodo,
    allTodoAfterAdition: updatedAllTodosAfterSave,
  });
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    params: { id },
    body,
  } = req;

  if (!body.title || !body.status || !id) {
    res.status(401).json({
      status: 401,
      errorMessage: `ValidationError: _id or required body properties is not defined.`,
    });
    return;
  }

  const updatedTodo = await TodoModel.findByIdAndUpdate({ _id: id }, body);
  const updatedAllTodosAfterUpdate = await TodoModel.find();

  if (!updatedTodo) {
    res.status(501).json({
      status: 501,
      errorMessage: "Edit Todo failed. Not implemented.",
    });

    return;
  }

  res.status(200).json({
    message: "Todo Successfully edited",
    updatedTodo,
    todos: updatedAllTodosAfterUpdate,
  });
};

export const removeTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    params: { id },
  } = req;

  if (!id) {
    res.status(401).json({
      status: 401,
      errorMessage: `ValidationError: Params _id not defined.`,
    });

    return;
  }

  const removedTodo = await TodoModel.findByIdAndRemove(id);
  const updatedAllTodoAfterRemove = await TodoModel.find();

  if (!removedTodo) {
    res.status(501).json({
      status: 501,
      errorMessage: "Remove Todo failed. Not implemented.",
    });

    return;
  }

  res.status(200).json({
    message: "Todo Successfully removed",
    removedTodo,
    todos: updatedAllTodoAfterRemove,
  });
};