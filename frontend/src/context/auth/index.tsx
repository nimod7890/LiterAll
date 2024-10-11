import { PropsWithChildren, useCallback, useMemo } from "react";
import AuthContext from "src/context/auth/AuthContext.ts";
import type { User } from "@/types/user";
import useUserStorage from "@hooks/storage/useUserStorage";
import useUserKeyStorage from "@hooks/storage/useUserKeyStorage";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser, clearUser] = useUserStorage();
  const [userKey, setUserKey, clearUserKey] = useUserKeyStorage();

  const setAuthData = useCallback(
    ({ user, userKey }: Partial<{ user: User; userKey: number }>) => {
      if (user) setUser(user);
      if (userKey) setUserKey(userKey);
    },
    [setUser, setUserKey],
  );

  const clearAuthData = useCallback(() => {
    clearUser();
    clearUserKey();
    window.location.reload();
  }, [clearUser, clearUserKey]);

  const authContext = useMemo(
    () => ({
      isAuthenticated: Boolean(userKey),
      userKey,
      user,
      setAuthData,
      clearAuthData,
    }),
    [user],
  );

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
