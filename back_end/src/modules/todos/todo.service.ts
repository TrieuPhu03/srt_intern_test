import { AppError } from "../../common/errors/app-error";
import { parsePagination } from "../../common/utils/pagination.util";
import { todoRepository } from "./todo.repository";
import { CreateTodoInput, ListTodoQuery, UpdateTodoInput } from "./todo.types";

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
      throw new AppError("Todo not found", 404, "TODO_NOT_FOUND");
    }
    return todo;
  },

  create: async (data: CreateTodoInput) => todoRepository.create(data),

  update: async (id: string, data: UpdateTodoInput) => {
    await todoService.getById(id);
    return todoRepository.update(id, data);
  },

  remove: async (id: string) => {
    await todoService.getById(id);
    await todoRepository.delete(id);
    return null;
  },

  toggleStatus: async (id: string) => {
    const todo = await todoService.getById(id);
    const nextStatus = todo.status === "PENDING" ? "COMPLETED" : "PENDING";
    return todoRepository.update(id, { status: nextStatus });
  },
};
