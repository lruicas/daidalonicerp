import { useState, useEffect, ReactNode } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import { useRole } from "@/contexts/RoleContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { role } = useRole();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => setFading(false), 300);
    return () => clearTimeout(t);
  }, [role]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NavBar />
      <main
        className={`flex-1 p-4 sm:p-8 transition-opacity duration-300 overflow-x-hidden ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
