import { memo, useCallback, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  }, [onSearchChange]);
  const handleStatusChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value as TodoStatus | "ALL");
  }, [onStatusChange]);

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
          onChange={handleSearchChange}
          placeholder={t("todos.search_placeholder")}
          className="pl-9"
        />
      </label>

      <Select
        value={status}
        onChange={handleStatusChange}
        aria-label={t("todos.filter_status_label")}
      >
        <option value="ALL">{t("todos.filter_all")}</option>
        <option value="PENDING">{t("todos.filter_pending")}</option>
        <option value="COMPLETED">{t("todos.filter_completed")}</option>
      </Select>
    </div>
  );
};

export default memo(TodoFilterBar);
