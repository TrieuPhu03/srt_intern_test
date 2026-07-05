import { Response } from "express";

export const ok = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const fail = (
  res: Response,
  statusCode: number,
  message: string,
  code = "ERROR",
  details?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: { code, details },
  });
};
