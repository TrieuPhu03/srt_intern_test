import { Request, Response } from "express";
import { notFoundHandler } from "../../../src/middlewares/not-found.middleware";

const buildRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("notFoundHandler", () => {
  it("returns a normalized 404 response for unmatched routes", () => {
    const req = {
      method: "GET",
      originalUrl: "/api/unknown",
    } as Request;
    const res = buildRes();

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route GET /api/unknown not found",
      error: { code: "ROUTE_NOT_FOUND", details: undefined },
    });
  });
});
