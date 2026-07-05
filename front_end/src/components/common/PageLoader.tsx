import { useTranslation } from "react-i18next";

const PageLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-64 items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
        <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>{t("common.loading")}</span>
      </div>
    </div>
  );
};

export default PageLoader;
