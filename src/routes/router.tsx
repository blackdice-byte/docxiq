import AppLayout from "@/layout/app.layout";
import ErrorView from "@/views/error-view";
import Landing from "@/views/landing";
import { createHashRouter } from "react-router-dom";

export const routes = createHashRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorView />,
  },
  {
    path: "/app",
    element: <AppLayout/>
  }
]);
