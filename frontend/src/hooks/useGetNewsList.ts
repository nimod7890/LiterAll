import useAuth from "@hooks/useAuth";
import QueryKeys from "@libraries/reactQuery/queryKeys";
import { useQuery } from "@tanstack/react-query";
import http from "@utils/api";

export default function useGetNewsList() {
  const { user } = useAuth();

  const {
    data: newsList,
    status,
    ...props
  } = useQuery({
    queryKey: [QueryKeys.NEWS_LIST, user?.exp],
    queryFn: () => http.get("/news-list"),
    enabled: Boolean(user?.exp),
  });

  return { newsList, ...props };
}
