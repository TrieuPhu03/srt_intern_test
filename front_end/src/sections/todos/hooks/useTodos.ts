import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PaginationMeta } from "@/types/api";
import { todoService } from "../services/todo.service";
import type {
  CreateTodoPayload,
  Todo,
  TodoListQuery,
  TodoStatus,
  UpdateTodoPayload,
} from "../types/todo.types";

const DEBOUNCE_MS = 400;
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<TodoStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

  const query: TodoListQuery = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      page,
      limit: PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [debouncedSearch, page, status],
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

  const createTodo = async (payload: CreateTodoPayload) => {
    await todoService.create(payload);
    await fetchTodos();
  };

  const updateTodo = async (id: string, payload: UpdateTodoPayload) => {
    await todoService.update(id, payload);
    await fetchTodos();
  };

  const toggleTodo = async (id: string) => {
    const previousTodos = todos;

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "PENDING" ? "COMPLETED" : "PENDING" }
          : todo,
      ),
    );

    try {
      await todoService.toggleStatus(id);
    } catch {
      setTodos(previousTodos);
      setError(t("todos.error"));
    }
  };

  const deleteTodo = async (id: string) => {
    await todoService.remove(id);
    await fetchTodos();
  };

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
