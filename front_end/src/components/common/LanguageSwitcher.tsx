import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/constants/app";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  const switchLanguage = async (language: SupportedLanguage) => {
    localStorage.setItem("app_lang", language);
    await i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-1" aria-label={t("app.language")}>
      {SUPPORTED_LANGUAGES.map((language) => (
        <Button
          key={language.code}
          type="button"
          variant={currentLanguage === language.code ? "secondary" : "ghost"}
          size="sm"
          onClick={() => void switchLanguage(language.code)}
        >
          {language.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
