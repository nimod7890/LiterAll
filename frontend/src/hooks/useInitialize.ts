import useGetUserInfo from "@hooks/useGetUserInfo";
import { useLayoutEffect } from "react";
import useAuth from "src/hooks/useAuth.ts";

export default function useInitialize() {
  const { user, setAuthData } = useAuth();
  const { userInfo, ...options } = useGetUserInfo();

  useLayoutEffect(() => {
    if (userInfo) {
      setAuthData({ user: userInfo });
    }
  }, [userInfo]);

  return { user, ...options };
}
