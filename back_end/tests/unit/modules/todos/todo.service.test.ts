import { Prisma, TodoStatus } from "@prisma/client";
import { AppError } from "../../../../src/common/errors/app-error";

jest.mock("../../../../src/modules/todos/todo.repository", () => ({
  todoRepository: {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import { todoRepository } from "../../../../src/modules/todos/todo.repository";
import { todoService } from "../../../../src/modules/todos/todo.service";

const mockedRepo = jest.mocked(todoRepository);

const sampleTodo = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Write unit tests",
  description: "Cover the service layer",
  status: TodoStatus.PENDING,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const prismaRecordNotFoundError = () =>
  new Prisma.PrismaClientKnownRequestError("Record not found", {
    code: "P2025",
    clientVersion: "test",
  });

describe("todoService.list", () => {
  it("returns items with pagination metadata", async () => {
    mockedRepo.findMany.mockResolvedValue([[sampleTodo], 1]);

    const result = await todoService.list({ page: "1", limit: "10" });

    expect(result).toEqual({
      items: [sampleTodo],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });

  it("passes search and status filters through to the repository", async () => {
    mockedRepo.findMany.mockResolvedValue([[], 0]);

    await todoService.list({ search: "readme", status: TodoStatus.COMPLETED });

    expect(mockedRepo.findMany).toHaveBeenCalledWith(
      { search: "readme", status: TodoStatus.COMPLETED },
      expect.objectContaining({ page: 1, limit: 10, sortBy: "createdAt" })
    );
  });

  it("rounds totalPages up when total is not an exact multiple of limit", async () => {
    mockedRepo.findMany.mockResolvedValue([[sampleTodo], 25]);

    const result = await todoService.list({ limit: "10" });

    expect(result.meta.totalPages).toBe(3);
  });
});

describe("todoService.getById", () => {
  it("returns the todo when it exists", async () => {
    mockedRepo.findById.mockResolvedValue(sampleTodo);

    await expect(todoService.getById(sampleTodo.id)).resolves.toEqual(sampleTodo);
  });

  it("throws a 404 AppError when the todo does not exist", async () => {
    mockedRepo.findById.mockResolvedValue(null);

    await expect(todoService.getById("missing-id")).rejects.toMatchObject({
      statusCode: 404,
      code: "TODO_NOT_FOUND",
      message: "Todo not found",
    });
  });
});

describe("todoService.create", () => {
  it("delegates to the repository with the given payload", async () => {
    mockedRepo.create.mockResolvedValue(sampleTodo);

    const result = await todoService.create({ title: "Write unit tests" });

    expect(mockedRepo.create).toHaveBeenCalledWith({ title: "Write unit tests" });
    expect(result).toEqual(sampleTodo);
  });
});

describe("todoService.update", () => {
  it("checks existence before updating", async () => {
    const updatedTodo = { ...sampleTodo, title: "Updated title" };
    mockedRepo.findById.mockResolvedValue(sampleTodo);
    mockedRepo.update.mockResolvedValue(updatedTodo);

    const result = await todoService.update(sampleTodo.id, { title: "Updated title" });

    expect(mockedRepo.findById).toHaveBeenCalledWith(sampleTodo.id);
    expect(mockedRepo.update).toHaveBeenCalledWith(sampleTodo.id, {
      title: "Updated title",
    });
    expect(result).toEqual(updatedTodo);
  });

  it("does not update when the todo does not exist", async () => {
    mockedRepo.findById.mockResolvedValue(null);

    await expect(todoService.update("missing-id", { title: "x" })).rejects.toThrow(
      AppError
    );
    expect(mockedRepo.update).not.toHaveBeenCalled();
  });

  it("maps Prisma record-not-found errors to a 404 AppError", async () => {
    mockedRepo.findById.mockResolvedValue(sampleTodo);
    mockedRepo.update.mockRejectedValue(prismaRecordNotFoundError());

    await expect(todoService.update(sampleTodo.id, { title: "x" })).rejects.toMatchObject({
      statusCode: 404,
      code: "TODO_NOT_FOUND",
      message: "Todo not found",
    });
  });
});

describe("todoService.remove", () => {
  it("checks existence before deleting", async () => {
    mockedRepo.findById.mockResolvedValue(sampleTodo);
    mockedRepo.delete.mockResolvedValue(sampleTodo);

    await expect(todoService.remove(sampleTodo.id)).resolves.toBeNull();

    expect(mockedRepo.findById).toHaveBeenCalledWith(sampleTodo.id);
    expect(mockedRepo.delete).toHaveBeenCalledWith(sampleTodo.id);
  });

  it("does not delete when the todo does not exist", async () => {
    mockedRepo.findById.mockResolvedValue(null);

    await expect(todoService.remove("missing-id")).rejects.toThrow(AppError);
    expect(mockedRepo.delete).not.toHaveBeenCalled();
  });

  it("maps Prisma record-not-found errors while deleting to a 404 AppError", async () => {
    mockedRepo.findById.mockResolvedValue(sampleTodo);
    mockedRepo.delete.mockRejectedValue(prismaRecordNotFoundError());

    await expect(todoService.remove(sampleTodo.id)).rejects.toMatchObject({
      statusCode: 404,
      code: "TODO_NOT_FOUND",
      message: "Todo not found",
    });
  });
});

describe("todoService.toggleStatus", () => {
  it("flips PENDING to COMPLETED", async () => {
    const completedTodo = { ...sampleTodo, status: TodoStatus.COMPLETED };
    mockedRepo.findById.mockResolvedValue({ ...sampleTodo, status: TodoStatus.PENDING });
    mockedRepo.update.mockResolvedValue(completedTodo);

    const result = await todoService.toggleStatus(sampleTodo.id);

    expect(mockedRepo.update).toHaveBeenCalledWith(sampleTodo.id, {
      status: TodoStatus.COMPLETED,
    });
    expect(result.status).toBe(TodoStatus.COMPLETED);
  });

  it("flips COMPLETED back to PENDING", async () => {
    const pendingTodo = { ...sampleTodo, status: TodoStatus.PENDING };
    mockedRepo.findById.mockResolvedValue({
      ...sampleTodo,
      status: TodoStatus.COMPLETED,
    });
    mockedRepo.update.mockResolvedValue(pendingTodo);

    const result = await todoService.toggleStatus(sampleTodo.id);

    expect(mockedRepo.update).toHaveBeenCalledWith(sampleTodo.id, {
      status: TodoStatus.PENDING,
    });
    expect(result.status).toBe(TodoStatus.PENDING);
  });

  it("throws AppError when the todo does not exist", async () => {
    mockedRepo.findById.mockResolvedValue(null);

    await expect(todoService.toggleStatus("missing-id")).rejects.toThrow(AppError);
    expect(mockedRepo.update).not.toHaveBeenCalled();
  });

  it("maps Prisma record-not-found errors while toggling to a 404 AppError", async () => {
    mockedRepo.findById.mockResolvedValue(sampleTodo);
    mockedRepo.update.mockRejectedValue(prismaRecordNotFoundError());

    await expect(todoService.toggleStatus(sampleTodo.id)).rejects.toMatchObject({
      statusCode: 404,
      code: "TODO_NOT_FOUND",
      message: "Todo not found",
    });
  });
});
