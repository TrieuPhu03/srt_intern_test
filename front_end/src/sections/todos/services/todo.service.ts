import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  CreateTodoPayload,
  Todo,
  TodoListQuery,
  UpdateTodoPayload,
} from "../types/todo.types";

export const todoService = {
  list: (query: TodoListQuery): Promise<ApiResponse<PaginatedResponse<Todo>>> => {
    return apiClient.get<unknown, ApiResponse<PaginatedResponse<Todo>>>("/todos", { params: query });
  },

  getById: (id: string): Promise<ApiResponse<Todo>> => {
    return apiClient.get<unknown, ApiResponse<Todo>>(`/todos/${id}`);
  },

  create: (payload: CreateTodoPayload): Promise<ApiResponse<Todo>> => {
    return apiClient.post<unknown, ApiResponse<Todo>>("/todos", payload);
  },

  update: (id: string, payload: UpdateTodoPayload): Promise<ApiResponse<Todo>> => {
    return apiClient.patch<unknown, ApiResponse<Todo>>(`/todos/${id}`, payload);
  },

  toggleStatus: (id: string): Promise<ApiResponse<Todo>> => {
    return apiClient.patch<unknown, ApiResponse<Todo>>(`/todos/${id}/toggle`);
  },

  remove: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<unknown, ApiResponse<null>>(`/todos/${id}`);
  },
};
