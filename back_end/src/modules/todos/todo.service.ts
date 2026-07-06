import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { parsePagination } from "../../common/utils/pagination.util";
import { todoRepository } from "./todo.repository";
import { CreateTodoInput, ListTodoQuery, UpdateTodoInput } from "./todo.types";

const todoNotFoundError = () => new AppError("Todo not found", 404, "TODO_NOT_FOUND");

const isPrismaRecordNotFoundError = (error: unknown) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
  );
};

const mapPrismaRecordNotFound = (error: unknown): never => {
  if (isPrismaRecordNotFoundError(error)) {
    throw todoNotFoundError();
  }

  throw error;
};

export const todoService = {
  list: async (query: ListTodoQuery) => {
    const pagination = parsePagination(query);
    const [items, total] = await todoRepository.findMany(
      {
        search: query.search,
        status: query.status,
      },
      pagination
    );

    return {
      items,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  },

  getById: async (id: string) => {
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw todoNotFoundError();
    }
    return todo;
  },

  create: async (data: CreateTodoInput) => todoRepository.create(data),

  update: async (id: string, data: UpdateTodoInput) => {
    await todoService.getById(id);
    try {
      return await todoRepository.update(id, data);
    } catch (error) {
      return mapPrismaRecordNotFound(error);
    }
  },

  remove: async (id: string) => {
    await todoService.getById(id);
    try {
      await todoRepository.delete(id);
    } catch (error) {
      mapPrismaRecordNotFound(error);
    }
    return null;
  },

  toggleStatus: async (id: string) => {
    const todo = await todoService.getById(id);
    const nextStatus = todo.status === "PENDING" ? "COMPLETED" : "PENDING";
    try {
      return await todoRepository.update(id, { status: nextStatus });
    } catch (error) {
      return mapPrismaRecordNotFound(error);
    }
  },
};
