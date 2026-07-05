import React from "react";
import { ThemeProvider } from "./theme-provider";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {children}
    </ThemeProvider>
  );
};
