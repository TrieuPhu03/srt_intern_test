import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface TodoPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const TodoPagination = ({ meta, onPageChange }: TodoPaginationProps) => {
  const { t } = useTranslation();

  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        {t("common.previous")}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t("common.page")} {meta.page} / {meta.totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        {t("common.next")}
      </Button>
    </div>
  );
};

export default TodoPagination;
