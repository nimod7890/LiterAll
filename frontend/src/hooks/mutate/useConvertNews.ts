import useAuth from "@hooks/useAuth";
import { News } from "@models/news";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import http from "@utils/api";

export type QuestionList = [
  { question: string; option: string[]; answer: 1 | 2 | 3 | 4 },
  { question: string; option: string[]; answer: 1 | 2 | 3 | 4 },
  { question: string; answer: string | null },
];

interface Response {
  converted_news: string;
  qa_list: QuestionList;
  image_url: string;
}

export default function useConvertNews(): UseMutationResult<Response, Error, News> {
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ content, image_url }) =>
      http.ai.post("/convert_news", {
        text: content,
        score: Math.floor(Math.sqrt(user?.exp ?? 0)),
        isImage: Boolean(image_url),
      }),
  });
}
