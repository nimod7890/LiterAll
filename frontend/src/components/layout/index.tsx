import Logo from "@components/layout/Logo";
import MyExp from "@components/layout/MyExp";
import useInitialize from "@hooks/useInitialize";
import { Outlet } from "react-router-dom";

export default function Layout() {
  useInitialize();

  return (
    <div className="relative flex h-screen min-w-max flex-col overflow-hidden">
      <div className="sticky top-0 z-50 flex justify-between px-8 py-6 h-8 items-center border-b-2 border-b-gray-100">
        <Logo />
        <MyExp />
      </div>
      <main className="flex flex-grow flex-col justify-between">
        <Outlet />
      </main>
    </div>
  );
}
