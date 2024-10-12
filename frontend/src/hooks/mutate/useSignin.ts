import useUserKeyStorage from "@hooks/storage/useUserKeyStorage";
import RoutePath from "@routes/routePath";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import http from "@utils/api";
import { useNavigate } from "react-router-dom";

export interface SigninFormData {
  id: string;
  password: string;
}

export default function useSignin(): UseMutationResult<
  { body: { user_key: number } },
  Error,
  SigninFormData
> {
  const navigate = useNavigate();
  const [, setUserKey] = useUserKeyStorage();

  return useMutation({
    mutationFn: (data: SigninFormData) => http.be.post("/login", { body: data }),
    onSuccess: ({ body: { user_key } }) => {
      setUserKey(user_key);
      navigate(RoutePath.Index);
    },
  });
}
