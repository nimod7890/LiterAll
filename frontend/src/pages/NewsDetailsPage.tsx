import useNewsStorage from "@hooks/storage/useNewsStorage";
import useConvertNews, { QuestionList } from "@hooks/mutate/useConvertNews";
import RoutePath from "@routes/routePath";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Separator } from "@components/ui/separator";
import { SymbolIcon, CheckIcon } from "@radix-ui/react-icons";
import useAuth from "@hooks/useAuth";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@components/ui/button";
import useGradingNews from "@hooks/mutate/useGradingNews";
import { Input } from "@components/ui/input";
import PendingContainer from "@components/layout/pending/PendingContainer";
interface Analysis {
  convertedNews: string;
  qaList: QuestionList;
  imageUrl: string | null;
}
type AnsType = [number | null, number | null];

export default function NewsDetailsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [originalNews] = useNewsStorage();
  console.log(originalNews);
  const { mutate: convert, isPending: isPendingConvertNews } = useConvertNews();
  const {
    mutate: grading,
    isPending: isPendingGradingNews,
    isSuccess: isSuccessGradingNews,
  } = useGradingNews();
  const [ans, setAns] = useState<AnsType>([null, null]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<string>("");

  useLayoutEffect(() => {
    if (originalNews) {
      convert(originalNews, {
        onSuccess: ({ converted_news: convertedNews, qa_list: qaList, image_url: imageUrl }) =>
          setAnalysis({ convertedNews, qaList, imageUrl }),
      });
    }
  }, [originalNews]);

  const disabledSubmitButton = useMemo(
    () => ans[0] == null || ans[1] == null || isPendingGradingNews,
    [ans, inputRef!.current?.value],
  );

  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { value } = inputRef!.current!;

      if (value !== "") {
        grading(
          {
            title: originalNews?.title as string,
            ans: [ans[0] as number, ans[1] as number, value],
            qa_list: analysis?.qaList as QuestionList,
            converted_news: analysis?.convertedNews as string,
          },
          {
            onSuccess: data => {
              setFeedback(data[1] as string);
            },
          },
        );
      }
    },
    [ans, analysis],
  );

  const imageUrl = useMemo(
    () => (originalNews?.image_url ? originalNews?.image_url : analysis?.imageUrl),
    [originalNews?.image_url, analysis?.imageUrl],
  );

  if (isPendingConvertNews) {
    return <PendingContainer message="AI가 뉴스를 변환하는 중이에요!" />;
  }

  if (!originalNews || !analysis) {
    navigate(RoutePath.Index);
    return null;
  }

  return (
    <div className="flex flex-col flex-grow gap-10 items-center p-10 pb-[100px]">
      <p className="font-medium">{originalNews.title}</p>
      <div className="flex flex-col gap-5 items-center w-[600px]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500 flex flex-row gap-2.5 items-center">
              <SymbolIcon />
              <p className="text-detail-2">기사 원문과 비교하기</p>
            </AccordionTrigger>
            <AccordionContent className="w-full break-keep">
              <div className="w-full border p-5 my-3 rounded-3 text-detail-2 text-gray-600 font-normal">
                {originalNews.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator />
        <div className="flex flex-col gap-2 items-center">
          <p className="text-detail-3 text-gray-400">
            아래는 AI가 {user?.name ?? "사용자"}님의 레벨에 맞게 변경한 기사예요~
          </p>
          <p className={`text-detail-2  flex flex-row gap-2`}>
            잘 읽고 퀴즈를 풀고 우리 함께
            <span className={`font-extrabold text-orange-400 mt-1`}>Lit</span>
            <span className={`font-extrabold  text-lime-500 mt-1 mr-2`}>UP!</span>
          </p>
        </div>
        <div className="w-full">{analysis.convertedNews}</div>
        {imageUrl && (
          <AspectRatio ratio={1 / 1} className="w-full">
            <img src={imageUrl} alt={originalNews.title} className="object-cover" />
          </AspectRatio>
        )}
        <Separator />
        <Accordion type="single" collapsible className="w-full mt-5">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500 w-full flex flex-col gap-1 items-center">
              <Button
                className="flex flex-row gap-2.5 items-center self-center"
                size="lg"
                variant={"destructive"}
              >
                <p className="text-detail-2">꼼꼼히 다 읽었어요</p>
                <CheckIcon />
              </Button>
              <p className="text-detail-3 text-gray-500">퀴즈 풀어보기</p>
            </AccordionTrigger>
            <AccordionContent className="w-full break-keep my-12 flex flex-col gap-5">
              {/* 퀴즈 1 */}
              <div className="flex flex-col gap-2 border p-5 rounded-3">
                <p className="text-detail-3 mb-3">Q1. {analysis.qaList[0].question}</p>
                <p className="text-detail-3 flex flex-col gap-1 items-start">
                  {analysis.qaList[0].option.map((option, index) => (
                    <Button
                      size="sm"
                      variant={"ghost"}
                      className={ans[0] == index + 1 ? "bg-purple-200" : ""}
                      key={option}
                      onClick={() =>
                        setAns(prev => {
                          const li: AnsType = [...prev];
                          li[0] = index + 1;
                          return li;
                        })
                      }
                    >
                      {index + 1}. {option}
                    </Button>
                  ))}
                </p>
              </div>
              {/* 퀴즈 2 */}
              <div className="flex flex-col gap-2 border p-5 rounded-3">
                <p className="text-detail-3 mb-3">Q2. {analysis.qaList[1].question}</p>
                <p className="text-detail-3 flex flex-col gap-1 items-start">
                  {analysis.qaList[1].option.map((option, index) => (
                    <Button
                      size="sm"
                      variant={"ghost"}
                      className={ans[1] == index + 1 ? "bg-purple-200" : ""}
                      key={option}
                      onClick={() =>
                        setAns(prev => {
                          const li: AnsType = [...prev];
                          li[1] = index + 1;
                          return li;
                        })
                      }
                    >
                      {index + 1}. {option}
                    </Button>
                  ))}
                </p>
              </div>
              {/* 퀴즈 3 */}
              <div className="flex flex-col gap-2 border p-5 rounded-3">
                <p className="text-detail-3 mb-3">Q3. {analysis.qaList[2].question}</p>
                <Input ref={inputRef} placeholder="세 문장 내외로 답변을 입력해주세요!" />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-detail-3 text-gray-500">채점하기</p>
                <Button
                  className="flex flex-row gap-2.5 items-center self-center"
                  size="lg"
                  disabled={disabledSubmitButton}
                  variant={"destructive"}
                  onClick={handleSubmit}
                >
                  <p className="text-detail-2">
                    {isPendingGradingNews || isSuccessGradingNews
                      ? "제출했어요"
                      : "꼼꼼히 다 풀었어요"}
                  </p>
                  <CheckIcon />
                </Button>
              </div>
              {feedback && (
                <div className="flex flex-col gap-2 mt-12">
                  <p>AI가 {user?.name ?? "사용자"}님이 제출한 퀴즈 결과를 분석해봤어요</p>
                  <div className="w-full border p-5 my-3 rounded-3 text-detail-2 text-gray-600 font-normal">
                    {feedback}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
