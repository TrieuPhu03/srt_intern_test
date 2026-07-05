export const APP_NAME = "SRT Todo";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tieng Viet" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];
