import { Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen gap-4 p-4 bg-background">
      <Card className="w-64 p-4 h-fit sticky top-4">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <nav className="space-y-2">
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Overview
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Analytics
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Reports
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Settings
            </a>
          </nav>
        </div>
      </Card>

      <Card className="flex-1 p-4 ">
        <Outlet />
      </Card>
    </div>
  );
};

export default AppLayout;
