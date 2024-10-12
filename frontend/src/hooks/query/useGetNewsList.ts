import QueryKeys from "@libraries/reactQuery/queryKeys";
import { News } from "@models/news";
import { useSuspenseQuery } from "@tanstack/react-query";
import http from "@utils/api";

const searches = ["연예", "축구"];
const encodedSearches = searches.map(encodeURIComponent).join(",");

export default function useGetNewsList() {
  const { data: newsList, ...props } = useSuspenseQuery({
    queryKey: [QueryKeys.NEWS_LIST, encodedSearches],
    queryFn: async () =>
      (await http.ai.get<{ result: News[] }>(`/recsys?searches=${encodedSearches}`)).result,
  });

  return { newsList, ...props };
}
