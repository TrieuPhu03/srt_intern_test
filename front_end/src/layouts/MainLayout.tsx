import { CheckSquare } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import { APP_NAME } from "@/constants/app";

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckSquare data-icon="inline-start" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{APP_NAME}</span>
              <span className="text-xs text-muted-foreground">{t("app.todo_workspace")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
