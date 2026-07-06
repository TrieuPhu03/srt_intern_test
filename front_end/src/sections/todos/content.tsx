import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import FormDialog from "@/components/common/FormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TodoFilterBar from "./components/TodoFilterBar";
import TodoForm, { type TodoFormValues } from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import TodoPagination from "./components/TodoPagination";
import { isTodoDuplicateError } from "./helpers/todo-error";
import { useTodos } from "./hooks/useTodos";
import type { Todo } from "./types/todo.types";

const TodosContent = () => {
  const { t } = useTranslation();
  const {
    todos,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    setPage,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.status === "COMPLETED").length;

    return {
      total: meta.total,
      completed,
      open: Math.max(todos.length - completed, 0),
    };
  }, [meta.total, todos]);

  const openCreateForm = useCallback(() => {
    setEditingTodo(null);
    setMutationError(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setMutationError(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTodo(null);
    setMutationError(null);
  }, []);

  const handleSubmit = useCallback(async (values: TodoFormValues) => {
    setMutationError(null);

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, values);
      } else {
        await createTodo(values);
      }

      closeForm();
    } catch (error) {
      setMutationError(
        isTodoDuplicateError(error) ? t("todos.duplicate_error") : t("todos.save_error"),
      );
    }
  }, [closeForm, createTodo, editingTodo, t, updateTodo]);

  const confirmDelete = useCallback(async (id: string) => {
    setMutationError(null);

    try {
      await deleteTodo(id);
    } catch {
      setMutationError(t("todos.delete_error"));
    }
  }, [deleteTodo, t]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, [setPage, setSearch]);

  const handleDelete = useCallback((id: string) => {
    const confirmToastId = toast.warning(t("todos.delete_confirm_title"), {
      description: t("todos.delete_confirm_description"),
      action: {
        label: t("todos.delete_confirm_action"),
        onClick: () => {
          toast.dismiss(confirmToastId);
          void confirmDelete(id);
        },
      },
      cancel: {
        label: t("todos.cancel"),
        onClick: () => toast.dismiss(confirmToastId),
      },
      duration: 8000,
    });
  }, [confirmDelete, t]);

  const handleFormOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }, [closeForm]);

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{t("todos.title")}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t("todos.subtitle")}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">
              {t("todos.stats_total")}: {stats.total}
            </Badge>
            <Badge variant="secondary">
              {t("todos.stats_done")}: {stats.completed}
            </Badge>
            <Badge variant="outline">
              {t("todos.stats_open")}: {stats.open}
            </Badge>
          </div>
        </div>
        <Button type="button" onClick={openCreateForm} className="sm:self-start">
          <Plus data-icon="inline-start" />
          {t("todos.add_button")}
        </Button>
      </div>

      <TodoFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={setStatus}
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          {t("todos.loading")}
        </div>
      ) : null}

      {!isLoading && todos.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          {t("todos.empty_state")}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <TodoPagination meta={meta} onPageChange={setPage} />

      <FormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        title={editingTodo ? t("todos.form_title_edit") : t("todos.form_title_create")}
        error={mutationError}
      >
        <TodoForm initialValues={editingTodo} onSubmit={handleSubmit} onCancel={closeForm} />
      </FormDialog>
    </section>
  );
};

export default TodosContent;
