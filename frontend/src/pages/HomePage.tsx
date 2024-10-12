import { AspectRatio } from "@components/ui/aspect-ratio";
import { Button } from "@components/ui/button";
import useGetNewsList from "@hooks/query/useGetNewsList";
import useNewsStorage from "@hooks/storage/useNewsStorage";
import useAuth from "@hooks/useAuth";
import { News } from "@models/news";
import RoutePath from "@routes/routePath";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();
  const { newsList } = useGetNewsList();
  const [, setNews] = useNewsStorage();
  const navigate = useNavigate();

  const onClick = (news: Pick<News, "title" | "content" | "image_url">) => {
    setNews(news);
    navigate(RoutePath.News);
  };

  return (
    <div className="flex flex-col gap-8 items-center p-10 overflow-scroll">
      <p className="text-body-1">
        {user?.name ?? "사용지"}님이 선택하신 키워드를 기반으로 추천된 뉴스 리스트를 보여드릴게요!
      </p>
      <div className="flex flex-col items-center gap-8 p-4">
        {newsList
          .filter(({ title }) => Boolean(title))
          .map(({ title, content, image_url }) => (
            <Button
              key={title}
              variant="secondary"
              onClick={() => onClick({ title, content, image_url })}
              className="flex flex-row w-full max-w-[1000px] overflow-hidden p-5 justify-center min-h-[100px]"
            >
              <div className="flex flex-col gap-2 w-full items-start">
                <p className="text-detail-2">{title}</p>
                <div className="w-full truncate text-detail-3 text-gray-500">{content}</div>
              </div>
              <AspectRatio ratio={16 / 9} className="h-full">
                {image_url && <img src={image_url} alt={title} className="object-cover" />}
              </AspectRatio>
            </Button>
          ))}
      </div>
    </div>
  );
}
