import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {children}
      <Toaster duration={3000} richColors position="top-center" />
    </ThemeProvider>
  );
};
