import { createContext } from "react";
import type { User } from "@/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userKey: number | null;
  setAuthData: ({ user, userKey }: Partial<{ user: User; userKey: number }>) => void;
  clearAuthData: () => void;
}

const initialAuthContext = {
  isAuthenticated: false,
  user: null,
  userKey: null,
  setAuthData: async () => {},
  clearAuthData: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export default AuthContext;
