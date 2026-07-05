import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { TodoStatus } from "../types/todo.types";

interface TodoFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TodoStatus | "ALL";
  onStatusChange: (value: TodoStatus | "ALL") => void;
}

const TodoFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: TodoFilterBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <label className="relative flex-1">
        <span className="sr-only">{t("todos.search_placeholder")}</span>
        <Search
          data-icon="inline-start"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("todos.search_placeholder")}
          className="pl-9"
        />
      </label>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as TodoStatus | "ALL")}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Filter todos by status"
      >
        <option value="ALL">{t("todos.filter_all")}</option>
        <option value="PENDING">{t("todos.filter_pending")}</option>
        <option value="COMPLETED">{t("todos.filter_completed")}</option>
      </select>
    </div>
  );
};

export default TodoFilterBar;
