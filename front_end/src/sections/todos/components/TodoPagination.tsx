import { memo } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import type { PaginationMeta } from "@/types/api";

interface TodoPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const TodoPagination = ({ meta, onPageChange }: TodoPaginationProps) => {
  const { limit, page, total } = meta;

  return <CustomPagination current={page} total={total} pageSize={limit} onPageChange={onPageChange} />;
};

export default memo(TodoPagination);
