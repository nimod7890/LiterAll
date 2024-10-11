import useAuth from "@hooks/useAuth";
import QueryKeys from "@libraries/reactQuery/queryKeys";
import { User } from "@models/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import http from "@utils/api";
import CustomError from "@utils/api/error";
import { useEffect } from "react";

export default function useGetNewsList() {
  const { userKey, clearAuthData } = useAuth();
  const { data: userInfo, status, ...props } = useSuspenseQuery(userInfoQueryOptions(userKey));

  useEffect(() => {
    if (status === "error") {
      clearAuthData();
      throw new CustomError("유저 정보를 불러오는 중에 문제가 발생하였습니다.", 400);
    }
  }, [status]);

  return { userInfo, ...props };
}

export const userInfoQueryOptions = (userKey: string | null) => ({
  queryKey: [QueryKeys.USER_INFO, userKey],
  queryFn: () => http.get<User>("/user-info"),
  enabled: Boolean(userKey),
});
