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
  const isCompleted = todo.status === "COMPLETED";

  return (
    <article className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isCompleted ? "border-primary bg-primary" : "border-input bg-background",
          )}
          aria-label={isCompleted ? t("todos.pending") : t("todos.completed")}
          aria-pressed={isCompleted}
        >
          {isCompleted ? <Check data-icon="inline-start" /> : null}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={cn(
                "truncate text-sm font-semibold",
                isCompleted && "text-muted-foreground line-through",
              )}
            >
              {todo.title}
            </h2>
            <Badge variant={isCompleted ? "secondary" : "outline"}>
              {isCompleted ? t("todos.completed") : t("todos.pending")}
            </Badge>
          </div>
          {todo.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{todo.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(todo)} aria-label="Edit todo">
          <Pencil data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          <Trash2 data-icon="inline-start" className="text-destructive" />
        </Button>
      </div>
    </article>
  );
};

export default TodoItem;
