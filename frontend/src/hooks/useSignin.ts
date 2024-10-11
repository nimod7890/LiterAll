import { useMutation } from "@tanstack/react-query";
import http from "@utils/api";

export interface SigninFormData {
  id: string;
  password: string;
}

export default function useSignin() {
  return useMutation({
    mutationFn: (data: SigninFormData) => http.post("/sign-in", data),
  });
}
