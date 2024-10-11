import { RouterProvider } from "react-router-dom";
import AppRegister from "@libraries/index";
import Router from "@styles/router";
import GlobalErrorBoundary from "@components/layout/GlobalErrorBoundary";
import GlobalFallback from "@components/layout/pending/GlobalFallback";

export default function App() {
  return (
    <AppRegister>
      <GlobalErrorBoundary>
        <RouterProvider router={Router} fallbackElement={<GlobalFallback />} />
      </GlobalErrorBoundary>
    </AppRegister>
  );
}
