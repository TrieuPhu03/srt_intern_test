import { createBrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "@/layouts/MainLayout";

export const ROUTES = {
  ROOT: "/",
} as const;

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-primary">{t("home.eyebrow")}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t("home.title")}</h1>
      <p className="text-sm leading-6 text-muted-foreground">{t("home.description")}</p>
    </section>
  );
};

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.ROOT,
        element: <HomePage />,
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
