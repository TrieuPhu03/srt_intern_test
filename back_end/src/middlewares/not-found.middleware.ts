import { Request, Response } from "express";
import { fail } from "../common/responses/api-response";

export const notFoundHandler = (req: Request, res: Response) => {
  return fail(
    res,
    404,
    `Route ${req.method} ${req.originalUrl} not found`,
    "ROUTE_NOT_FOUND"
  );
};
