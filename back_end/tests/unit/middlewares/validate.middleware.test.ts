import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../../src/common/errors/app-error";
import { validate } from "../../../src/middlewares/validate.middleware";

const buildReq = (overrides: Partial<Request> = {}) =>
  ({ body: {}, query: {}, params: {}, ...overrides } as Request);

const schema = z.object({
  body: z.object({ title: z.string().min(1) }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

describe("validate middleware", () => {
  it("calls next with no error when the payload is valid", () => {
    const req = buildReq({ body: { title: "Valid title" } });
    const next = jest.fn() as NextFunction;

    validate(schema)(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("passes a 422 AppError to next when validation fails", () => {
    const req = buildReq({ body: { title: "" } });
    const next = jest.fn() as NextFunction;

    validate(schema)(req, {} as Response, next);

    const errorArg = (next as jest.Mock).mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(AppError);
    expect(errorArg).toMatchObject({
      statusCode: 422,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
    });
  });

  it("writes parsed body, query, and params back to the request", () => {
    const trimSchema = z.object({
      body: z.object({ title: z.string().trim() }),
      query: z.object({ page: z.coerce.number().default(1) }),
      params: z.object({ id: z.string().trim() }),
    });
    const req = buildReq({
      body: { title: "  padded title  " },
      query: {},
      params: { id: "  todo-id  " },
    });
    const next = jest.fn() as NextFunction;

    validate(trimSchema)(req, {} as Response, next);

    expect(req.body).toEqual({ title: "padded title" });
    expect(req.query).toEqual({ page: 1 });
    expect(req.params).toEqual({ id: "todo-id" });
    expect(next).toHaveBeenCalledWith();
  });
});
