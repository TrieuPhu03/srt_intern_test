export type TodoStatus = "PENDING" | "COMPLETED";

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export interface TodoListQuery {
  search?: string;
  status?: TodoStatus;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
}
