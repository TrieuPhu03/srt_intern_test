import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface TodoPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const TodoPagination = ({ meta, onPageChange }: TodoPaginationProps) => {
  const { t } = useTranslation();
  const { page, totalPages } = meta;

  const handlePreviousPage = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const handleNextPage = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={handlePreviousPage}
      >
        {t("common.previous")}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t("common.page")} {page} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={handleNextPage}
      >
        {t("common.next")}
      </Button>
    </div>
  );
};

export default memo(TodoPagination);
