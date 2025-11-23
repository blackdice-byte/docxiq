import AppLayout from "@/layout/app.layout";
import ErrorView from "@/views/error-view";
import Landing from "@/views/landing";
import { createHashRouter } from "react-router-dom";
import { appRoutes } from "./app.routes";

export const routes = createHashRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorView />,
  },
  {
    path: "/app",
    element: <AppLayout/>,
    children: [...appRoutes]
  }
]);
