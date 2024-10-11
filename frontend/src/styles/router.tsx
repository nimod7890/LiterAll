import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import RoutePath from "@routes/routePath";
import { Suspense } from "react";
import root from "@routes/loader/root";
import Layout from "@components/layout";
import HomePage from "@pages/HomePage";
import NewsDetailsPage from "@pages/NewsDetailsPage";
import AuthProvider from "@context/auth";
import NotFoundErrorPage from "@pages/error/NotFoundErrorPage";
import LoginPage from "@pages/LoginPage";

const routes: RouteObject[] = [
  {
    path: RoutePath.Index,
    loader: root,
    element: (
      <Suspense>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <AuthProvider>
            <Layout />
          </AuthProvider>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          { path: RoutePath.News, element: <NewsDetailsPage /> },
        ],
      },
    ],
  },

  {
    path: RoutePath.Login,
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
];

const Router = createBrowserRouter(routes);

export default Router;
