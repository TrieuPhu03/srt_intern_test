import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { Pagination } from "../../common/utils/pagination.util";
import {
  CreateTodoInput,
  TodoDuplicateLookup,
  TodoFilters,
  UpdateTodoInput,
} from "./todo.types";

export const todoRepository = {
  findMany: (filters: TodoFilters, pagination: Pagination) => {
    const where: Prisma.TodoWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    };

    return prisma.$transaction([
      prisma.todo.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
      }),
      prisma.todo.count({ where }),
    ]);
  },

  findById: (id: string) => prisma.todo.findUnique({ where: { id } }),

  findDuplicate: ({ title, description, excludeId }: TodoDuplicateLookup) =>
    prisma.todo.findFirst({
      where: {
        title,
        description,
        ...(excludeId && { id: { not: excludeId } }),
      },
    }),

  create: (data: CreateTodoInput) => prisma.todo.create({ data }),

  update: (id: string, data: UpdateTodoInput) =>
    prisma.todo.update({ where: { id }, data }),

  delete: (id: string) => prisma.todo.delete({ where: { id } }),
};
