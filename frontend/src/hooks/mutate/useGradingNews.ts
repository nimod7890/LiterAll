import { QuestionList } from "@hooks/mutate/useConvertNews";
import useAuth from "@hooks/useAuth";
import QueryKeys from "@libraries/reactQuery/queryKeys";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import http from "@utils/api";

type Response = [number, string]; // [score, Q3 feedback]

export interface Request {
  title: string;
  ans: [number, number, string];
  qa_list: QuestionList;
  converted_news: string;
}

export default function useGradingNews(): UseMutationResult<Response, Error, Request> {
  const { user, userKey } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data =>
      (
        await http.ai.post<{ result: Response }, Request & { user_id: number; exp: number }>(
          "/grading",
          {
            ...data,
            user_id: userKey as number,
            exp: user?.exp as number,
          },
        )
      ).result,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_INFO, userKey] });
    },
  });
}
