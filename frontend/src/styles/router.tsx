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
import ErrorPage from "@pages/error/ErrorPage";
import GlobalFallback from "@components/layout/pending/GlobalFallback";

const routes: RouteObject[] = [
  {
    path: RoutePath.Index,
    loader: root,
    errorElement: <ErrorPage message="알 수 없는 오류가 발생했어요!" />,
    element: (
      <Suspense fallback={<GlobalFallback />}>
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
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <HomePage />
              </Suspense>
            ),
          },
          {
            path: RoutePath.News,
            element: <NewsDetailsPage />,
          },
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
