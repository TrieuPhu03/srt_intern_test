import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes";
import { AppProvider } from "@/providers/app-provider";

const App: React.FC = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
