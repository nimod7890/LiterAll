import MyExp from "@components/layout/MyExp";
import useInitialize from "@hooks/useInitialize";
import { Outlet } from "react-router-dom";

export default function Layout() {
  useInitialize();

  return (
    <div className="relative flex h-screen min-w-max flex-col overflow-hidden">
      <div className="sticky top-0 z-50">
        <MyExp />
      </div>
      <main className="flex flex-grow flex-col justify-between">
        <Outlet />
      </main>
    </div>
  );
}
