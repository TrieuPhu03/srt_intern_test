import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { parsePagination } from "../../common/utils/pagination.util";
import { todoRepository } from "./todo.repository";
import { CreateTodoInput, ListTodoQuery, UpdateTodoInput } from "./todo.types";

const todoNotFoundError = () => new AppError("Todo not found", 404, "TODO_NOT_FOUND");
const todoDuplicateError = () =>
  new AppError(
    "A todo with the same title and description already exists",
    409,
    "TODO_DUPLICATE"
  );

const normalizeTitle = (title: string) => title.trim();

const normalizeDescription = (description?: string | null) => {
  const normalizedDescription = description?.trim();
  return normalizedDescription ? normalizedDescription : null;
};

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

const assertTodoIsUnique = async (
  title: string,
  description: string | null,
  excludeId?: string
) => {
  const duplicateTodo = await todoRepository.findDuplicate({
    title,
    description,
    excludeId,
  });

  if (duplicateTodo) {
    throw todoDuplicateError();
  }
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

  create: async (data: CreateTodoInput) => {
    const title = normalizeTitle(data.title);
    const description = normalizeDescription(data.description);

    await assertTodoIsUnique(title, description);

    return todoRepository.create({ ...data, title, description });
  },

  update: async (id: string, data: UpdateTodoInput) => {
    const existingTodo = await todoService.getById(id);
    const shouldCheckDuplicate = "title" in data || "description" in data;
    const title = "title" in data ? normalizeTitle(data.title ?? "") : existingTodo.title;
    const description =
      "description" in data
        ? normalizeDescription(data.description)
        : normalizeDescription(existingTodo.description);

    if (shouldCheckDuplicate) {
      await assertTodoIsUnique(title, description, id);
    }

    const updateData: UpdateTodoInput = {
      ...data,
      ...("title" in data && { title }),
      ...("description" in data && { description }),
    };

    try {
      return await todoRepository.update(id, updateData);
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
