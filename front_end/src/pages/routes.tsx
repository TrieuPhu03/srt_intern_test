import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

export const ROUTES = {
  ROOT: "/",
  TODOS: "/todos",
} as const;

const TodosPage = React.lazy(() => import("./todos"));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.ROOT,
        element: <Navigate to={ROUTES.TODOS} replace />,
      },
      {
        path: ROUTES.TODOS,
        element: <TodosPage />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center bg-background text-xl font-bold text-foreground">
        404 - Page Not Found
      </div>
    ),
  },
]);
