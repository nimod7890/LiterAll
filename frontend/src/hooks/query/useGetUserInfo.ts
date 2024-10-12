import useAuth from "@hooks/useAuth";
import QueryKeys from "@libraries/reactQuery/queryKeys";
import { User } from "@models/user";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import http from "@utils/api";
import CustomError from "@utils/api/error";
import { useEffect } from "react";

export default function useGetUserInfo() {
  const { userKey, clearAuthData } = useAuth();
  const { data: userInfo, status, ...props } = useQuery<User>(userInfoQueryOptions(userKey));

  useEffect(() => {
    if (status === "error") {
      clearAuthData();
      throw new CustomError("유저 정보를 불러오는 중에 문제가 발생하였습니다.", 400);
    }
  }, [status]);

  return { userInfo: userInfo as User, ...props };
}

export const userInfoQueryOptions = (userKey: number | null): UseQueryOptions<User> => ({
  queryKey: [QueryKeys.USER_INFO, userKey],
  queryFn: async () => (await http.be.get<{ body: User }>(`/user?user_key=${userKey}`)).body,
  enabled: Boolean(userKey),
});
