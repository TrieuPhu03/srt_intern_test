import { Request, Response } from "express";
import { TodoStatus } from "@prisma/client";

jest.mock("../../../../src/modules/todos/todo.service", () => ({
  todoService: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleStatus: jest.fn(),
  },
}));

import { todoController } from "../../../../src/modules/todos/todo.controller";
import { todoService } from "../../../../src/modules/todos/todo.service";

const mockedService = jest.mocked(todoService);

const sampleTodo = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "New todo",
  description: null,
  status: TodoStatus.PENDING,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const buildRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("todoController.list", () => {
  it("calls todoService.list with req.query and returns a success response", async () => {
    const res = buildRes();
    const next = jest.fn();
    const payload = { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    mockedService.list.mockResolvedValue(payload);

    await todoController.list({ query: { search: "milk" } } as unknown as Request, res, next);

    expect(mockedService.list).toHaveBeenCalledWith({ search: "milk" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Todos fetched successfully",
      data: payload,
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("todoController.getById", () => {
  it("calls todoService.getById with req.params.id", async () => {
    const res = buildRes();
    const next = jest.fn();
    mockedService.getById.mockResolvedValue(sampleTodo);

    await todoController.getById(
      { params: { id: sampleTodo.id } } as unknown as Request,
      res,
      next
    );

    expect(mockedService.getById).toHaveBeenCalledWith(sampleTodo.id);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Todo fetched successfully",
      data: sampleTodo,
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("todoController.create", () => {
  it("calls todoService.create with req.body and responds with 201", async () => {
    const res = buildRes();
    const next = jest.fn();
    mockedService.create.mockResolvedValue(sampleTodo);

    await todoController.create({ body: { title: "New todo" } } as Request, res, next);

    expect(mockedService.create).toHaveBeenCalledWith({ title: "New todo" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Todo created successfully",
      data: sampleTodo,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards service errors to next", async () => {
    const res = buildRes();
    const next = jest.fn();
    const error = new Error("DB down");
    mockedService.create.mockRejectedValue(error);

    await todoController.create({ body: {} } as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("todoController.update", () => {
  it("calls todoService.update with params.id and req.body", async () => {
    const res = buildRes();
    const next = jest.fn();
    const updatedTodo = { ...sampleTodo, title: "Updated todo" };
    mockedService.update.mockResolvedValue(updatedTodo);

    await todoController.update(
      { params: { id: sampleTodo.id }, body: { title: "Updated todo" } } as unknown as Request,
      res,
      next
    );

    expect(mockedService.update).toHaveBeenCalledWith(sampleTodo.id, {
      title: "Updated todo",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("todoController.remove", () => {
  it("calls todoService.remove with req.params.id", async () => {
    const res = buildRes();
    const next = jest.fn();
    mockedService.remove.mockResolvedValue(null);

    await todoController.remove({ params: { id: "1" } } as unknown as Request, res, next);

    expect(mockedService.remove).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Todo deleted successfully",
      data: null,
    });
  });
});

describe("todoController.toggleStatus", () => {
  it("calls todoService.toggleStatus with req.params.id", async () => {
    const res = buildRes();
    const next = jest.fn();
    const completedTodo = { ...sampleTodo, status: TodoStatus.COMPLETED };
    mockedService.toggleStatus.mockResolvedValue(completedTodo);

    await todoController.toggleStatus(
      { params: { id: sampleTodo.id } } as unknown as Request,
      res,
      next
    );

    expect(mockedService.toggleStatus).toHaveBeenCalledWith(sampleTodo.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Todo status toggled successfully",
      data: completedTodo,
    });
  });
});
