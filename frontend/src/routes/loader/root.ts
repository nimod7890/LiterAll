import STORAGE_KEYS from "@constants/storage";
import { userInfoQueryOptions } from "@hooks/query/useGetUserInfo";
import { queryClient } from "@libraries/reactQuery/ReactQuerySetting";
import RoutePath from "@routes/routePath";
import { defer } from "lodash";
import { redirect } from "react-router-dom";

export default async function root() {
  try {
    const userKey = localStorage.getItem(STORAGE_KEYS.USER_KEY);
    if (!userKey) {
      throw new Response("사용자 정보를 불러오기 위한 user key가 존재하지 않습니다", {
        status: 404,
      });
    }

    const user = await queryClient.ensureQueryData(userInfoQueryOptions(JSON.parse(userKey)));

    return defer(() => ({ user }));
  } catch (error) {
    console.error(error);
    return redirect(RoutePath.Login);
  }
}
