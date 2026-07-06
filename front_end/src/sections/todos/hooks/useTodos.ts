import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PaginationMeta } from "@/types/api";
import { todoService } from "../services/todo.service";
import type {
  CreateTodoPayload,
  Todo,
  TodoListQuery,
  TodoStatus,
  UpdateTodoPayload,
} from "../types/todo.types";

const PAGE_SIZE = 10;

export function useTodos() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TodoStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query: TodoListQuery = useMemo(
    () => ({
      search: search || undefined,
      status: status === "ALL" ? undefined : status,
      page,
      limit: PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [page, search, status],
  );

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await todoService.list(query);
      setTodos(response.data.items);
      setMeta(response.data.meta);
    } catch {
      setError(t("todos.error"));
    } finally {
      setIsLoading(false);
    }
  }, [query, t]);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const createTodo = useCallback(async (payload: CreateTodoPayload) => {
    try {
      await todoService.create(payload);
      toast.success(t("todos.toast_create_success"));
      await fetchTodos();
    } catch (error) {
      toast.error(t("todos.toast_create_error"));
      throw error;
    }
  }, [fetchTodos, t]);

  const updateTodo = useCallback(async (id: string, payload: UpdateTodoPayload) => {
    try {
      await todoService.update(id, payload);
      toast.success(t("todos.toast_update_success"));
      await fetchTodos();
    } catch (error) {
      toast.error(t("todos.toast_update_error"));
      throw error;
    }
  }, [fetchTodos, t]);

  const toggleTodo = useCallback(async (id: string) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) {
      return;
    }

    const previousStatus = targetTodo.status;
    const nextStatus = targetTodo?.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, status: nextStatus } : todo,
      ),
    );

    try {
      await todoService.toggleStatus(id);
      toast.success(
        t(
          nextStatus === "COMPLETED"
            ? "todos.toast_complete_success"
            : "todos.toast_reopen_success",
        ),
      );
    } catch {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id && todo.status === nextStatus
            ? { ...todo, status: previousStatus }
            : todo,
        ),
      );
      setError(t("todos.error"));
      toast.error(t("todos.toast_toggle_error"));
    }
  }, [todos, t]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoService.remove(id);
      toast.success(t("todos.toast_delete_success"));
      await fetchTodos();
    } catch (error) {
      toast.error(t("todos.toast_delete_error"));
      throw error;
    }
  }, [fetchTodos, t]);

  return {
    todos,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
