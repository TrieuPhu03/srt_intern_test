import React, { Suspense } from "react";
import PageLoader from "@/components/common/PageLoader";

const TodosContent = React.lazy(() => import("@/sections/todos/content"));

const TodosPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <TodosContent />
    </Suspense>
  );
};

export default TodosPage;
