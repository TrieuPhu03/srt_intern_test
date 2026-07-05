import { Request, Response } from "express";
import { AppError } from "../../../src/common/errors/app-error";
import { errorHandler } from "../../../src/middlewares/error-handler.middleware";

const buildRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler", () => {
  it("responds with an AppError status, message, code, and details", () => {
    const res = buildRes();
    const error = new AppError("Todo not found", 404, "TODO_NOT_FOUND", {
      id: ["Invalid todo id"],
    });

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Todo not found",
      error: {
        code: "TODO_NOT_FOUND",
        details: { id: ["Invalid todo id"] },
      },
    });
  });

  it("responds with 500 and a generic payload for unexpected errors", () => {
    const res = buildRes();
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    errorHandler(new Error("Something exploded"), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_SERVER_ERROR", details: undefined },
    });
  });

  it("does not leak unexpected error messages in the JSON response", () => {
    const res = buildRes();
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    errorHandler(new Error("Sensitive internal detail"), {} as Request, res, jest.fn());

    const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
    expect(JSON.stringify(jsonArg)).not.toContain("Sensitive internal detail");
  });
});
