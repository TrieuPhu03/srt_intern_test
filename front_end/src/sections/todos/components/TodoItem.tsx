import { memo, useCallback } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Todo } from "../types/todo.types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  const { t } = useTranslation();
  const { id, title, description, status } = todo;
  const isCompleted = status === "COMPLETED";

  const handleToggle = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  const handleEdit = useCallback(() => {
    onEdit(todo);
  }, [onEdit, todo]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <article className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Button
          type="button"
          variant={isCompleted ? "default" : "outline"}
          size="icon"
          onClick={handleToggle}
          className="mt-0.5 size-5 shrink-0 rounded p-0"
          aria-label={isCompleted ? t("todos.mark_pending") : t("todos.mark_completed")}
          aria-pressed={isCompleted}
        >
          {isCompleted ? <Check data-icon="inline-start" /> : null}
        </Button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={cn(
                "truncate text-sm font-semibold",
                isCompleted && "text-muted-foreground line-through",
              )}
            >
              {title}
            </h2>
            <Badge variant={isCompleted ? "secondary" : "outline"}>
              {isCompleted ? t("todos.completed") : t("todos.pending")}
            </Badge>
          </div>
          {description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={handleEdit} aria-label={t("todos.edit_label")}>
          <Pencil data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={t("todos.delete_label")}
        >
          <Trash2 data-icon="inline-start" className="text-destructive" />
        </Button>
      </div>
    </article>
  );
};

export default memo(TodoItem);
