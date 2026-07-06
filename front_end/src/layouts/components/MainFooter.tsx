import { useTranslation } from "react-i18next";
import { APP_NAME } from "@/constants/app";

const STACK_ITEMS = ["React", "Express", "Prisma"] as const;

const MainFooter = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/80">
      <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {APP_NAME}
          </span>
          <span className="max-w-md text-xs leading-5 text-muted-foreground">
            {t("app.footer_note")}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {STACK_ITEMS.map((item) => (
              <span
                key={item}
                className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            {t("app.footer_copyright", {
              year: currentYear,
              appName: APP_NAME,
            })}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
