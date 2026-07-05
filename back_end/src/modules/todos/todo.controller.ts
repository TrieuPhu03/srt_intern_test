import { NextFunction, Request, Response } from "express";
import { ok } from "../../common/responses/api-response";
import { todoService } from "./todo.service";

export const todoController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await todoService.list(req.query);
      return ok(res, result, "Todos fetched successfully");
    } catch (error) {
      return next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await todoService.getById(req.params.id);
      return ok(res, todo, "Todo fetched successfully");
    } catch (error) {
      return next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await todoService.create(req.body);
      return ok(res, todo, "Todo created successfully", 201);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await todoService.update(req.params.id, req.body);
      return ok(res, todo, "Todo updated successfully");
    } catch (error) {
      return next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await todoService.remove(req.params.id);
      return ok(res, result, "Todo deleted successfully");
    } catch (error) {
      return next(error);
    }
  },

  toggleStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await todoService.toggleStatus(req.params.id);
      return ok(res, todo, "Todo status toggled successfully");
    } catch (error) {
      return next(error);
    }
  },
};
