import useNewsStorage from "@hooks/storage/useNewsStorage";
import { News } from "@models/news";
import RoutePath from "@routes/routePath";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import http from "@utils/api";

export interface LinkFormData {
  url: string;
}

export default function useChangeLinkToText(): UseMutationResult<
  { result: Pick<News, "title" | "content" | "image_url"> },
  Error,
  LinkFormData
> {
  const [, setNews] = useNewsStorage();

  return useMutation({
    mutationFn: (data: LinkFormData) => http.ai.post("/link_to_text", data),
    onSuccess: ({ result }) => {
      setNews(result);
      window.location.href = RoutePath.News;
    },
  });
}
