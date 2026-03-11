import { ReactNode } from "react";
import Header from "./Header";
import NavBar from "./NavBar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NavBar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AppLayout;
