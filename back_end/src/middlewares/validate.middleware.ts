import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../common/errors/app-error";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Validation failed",
            422,
            "VALIDATION_ERROR",
            error.flatten().fieldErrors
          )
        );
      }
      return next(error);
    }
  };
