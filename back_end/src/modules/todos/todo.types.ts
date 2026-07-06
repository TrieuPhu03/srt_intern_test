import { TodoStatus } from "@prisma/client";

export type CreateTodoInput = {
  title: string;
  description?: string | null;
};

export type UpdateTodoInput = {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
};

export type TodoDuplicateLookup = {
  title: string;
  description: string | null;
  excludeId?: string;
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
