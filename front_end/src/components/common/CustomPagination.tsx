import { memo, useCallback } from "react";
import Pagination from "antd/es/pagination";
import type { PaginationProps } from "antd/es/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps
  extends Omit<PaginationProps, "current" | "onChange" | "pageSize" | "total"> {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  className?: string;
}

const CustomPagination = ({
  current,
  total,
  onPageChange,
  pageSize = 10,
  className,
  hideOnSinglePage = true,
  showSizeChanger = false,
  align = "center",
  ...props
}: CustomPaginationProps) => {
  const handlePageChange = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);

  if (hideOnSinglePage && total <= pageSize) {
    return null;
  }

  return (
    <div className={cn("custom-pagination flex justify-center pt-2", className)}>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
        hideOnSinglePage={hideOnSinglePage}
        showSizeChanger={showSizeChanger}
        align={align}
        {...props}
      />
    </div>
  );
};

export default memo(CustomPagination);
