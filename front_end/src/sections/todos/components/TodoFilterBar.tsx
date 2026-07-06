import { memo, useCallback, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import SearchInput from "@/components/common/SearchInput";
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
  const handleStatusChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value as TodoStatus | "ALL");
  }, [onStatusChange]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        value={search}
        onDebouncedChange={onSearchChange}
        ariaLabel={t("todos.search_placeholder")}
        placeholder={t("todos.search_placeholder")}
      />

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
