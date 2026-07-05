import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errors/app-error";
import { fail } from "../common/responses/api-response";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.message, err.code, err.details);
  }

  console.error("Unexpected error:", err);
  return fail(res, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
};
