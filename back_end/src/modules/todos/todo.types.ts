import { TodoStatus } from "@prisma/client";

export type CreateTodoInput = {
  title: string;
  description?: string;
};

export type UpdateTodoInput = {
  title?: string;
  description?: string;
  status?: TodoStatus;
};

export type TodoFilters = {
  search?: string;
  status?: TodoStatus;
};

export type ListTodoQuery = TodoFilters & {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};
