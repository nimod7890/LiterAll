import { PropsWithChildren } from "react";
import ReactQuerySetting from "@libraries/reactQuery/ReactQuerySetting";
import ToastSetting from "@libraries/toast/ToastSetting";

export default function AppRegister({ children }: PropsWithChildren) {
  return (
    <ReactQuerySetting>
      {children}
      <ToastSetting />
    </ReactQuerySetting>
  );
}
