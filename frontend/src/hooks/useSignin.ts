import useUserKeyStorage from "@hooks/storage/useUserKeyStorage";
import RoutePath from "@routes/routePath";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export interface SigninFormData {
  id: string;
  password: string;
}

export default function useSignin(): UseMutationResult<{ userKey: number }, Error, SigninFormData> {
  const navigate = useNavigate();
  const [, setUserKey] = useUserKeyStorage();
  return useMutation({
    // mutationFn: (data: SigninFormData) => http.post("/sign-in", data),
    mutationFn: async () => await Promise.resolve({ userKey: 1234 }),
    onSuccess: ({ userKey }) => {
      setUserKey(userKey);
      navigate(RoutePath.Index);
    },
  });
}
