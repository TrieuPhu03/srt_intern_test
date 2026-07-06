import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  CreateTodoPayload,
  Todo,
  TodoListQuery,
  UpdateTodoPayload,
} from "../types/todo.types";

const todoApiBasePath = "/todos";

export const todoApiRoutes = {
  list: todoApiBasePath,
  detail: (id: string) => `${todoApiBasePath}/${id}`,
  create: todoApiBasePath,
  update: (id: string) => `${todoApiBasePath}/${id}`,
  toggleStatus: (id: string) => `${todoApiBasePath}/${id}/toggle`,
  remove: (id: string) => `${todoApiBasePath}/${id}`,
} as const;

export const todoService = {
  list: (query: TodoListQuery): Promise<ApiResponse<PaginatedResponse<Todo>>> => {
    return apiClient.get<unknown, ApiResponse<PaginatedResponse<Todo>>>(todoApiRoutes.list, {
      params: query,
    });
  },

  getById: (id: string): Promise<ApiResponse<Todo>> => {
    return apiClient.get<unknown, ApiResponse<Todo>>(todoApiRoutes.detail(id));
  },

  create: (payload: CreateTodoPayload): Promise<ApiResponse<Todo>> => {
    return apiClient.post<unknown, ApiResponse<Todo>>(todoApiRoutes.create, payload);
  },

  update: (id: string, payload: UpdateTodoPayload): Promise<ApiResponse<Todo>> => {
    return apiClient.patch<unknown, ApiResponse<Todo>>(todoApiRoutes.update(id), payload);
  },

  toggleStatus: (id: string): Promise<ApiResponse<Todo>> => {
    return apiClient.patch<unknown, ApiResponse<Todo>>(todoApiRoutes.toggleStatus(id));
  },

  remove: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<unknown, ApiResponse<null>>(todoApiRoutes.remove(id));
  },
};
