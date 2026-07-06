import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/constants/app";

interface LanguageOptionButtonProps {
  code: SupportedLanguage;
  isActive: boolean;
  onSelect: (language: SupportedLanguage) => void;
}

const LanguageOptionButton = memo(({ code, isActive, onSelect }: LanguageOptionButtonProps) => {
  const handleSelect = useCallback(() => {
    onSelect(code);
  }, [code, onSelect]);

  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={handleSelect}
    >
      {code.toUpperCase()}
    </Button>
  );
});
LanguageOptionButton.displayName = "LanguageOptionButton";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  const switchLanguage = useCallback(async (language: SupportedLanguage) => {
    localStorage.setItem("app_lang", language);
    await i18n.changeLanguage(language);
  }, [i18n]);

  return (
    <div className="flex items-center gap-1" aria-label={t("app.language")}>
      {SUPPORTED_LANGUAGES.map((language) => (
        <LanguageOptionButton
          key={language.code}
          code={language.code}
          isActive={currentLanguage === language.code}
          onSelect={switchLanguage}
        />
      ))}
    </div>
  );
};

export default memo(LanguageSwitcher);
