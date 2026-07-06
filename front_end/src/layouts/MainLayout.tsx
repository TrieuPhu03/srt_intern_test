import { Outlet } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import MainHeader from "./components/MainHeader";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MainHeader />
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
