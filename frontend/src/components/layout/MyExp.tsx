import { Progress } from "@components/ui/progress";
import useGetUserInfo from "@hooks/query/useGetUserInfo";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useMemo } from "react";

export default function MyExp() {
  const { userInfo } = useGetUserInfo();
  const { exp } = userInfo;

  const { level, currentExp } = useMemo(
    () => ({
      level: Math.floor(Math.sqrt(exp)),
      currentExp: exp % 100,
    }),
    [exp],
  );
  return (
    <div className="flex flex-row gap-2 items-center justify-center w-[180px]">
      <p className="min-w-max font-medium text-detail-3 mr-1 text-gray-700">나는 지금</p>
      <p className="text-purple-500 font-bold text-detail-2">Lv. {level}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Progress value={currentExp} className="w-[80px]" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-100 text-detail-3 text-purple-300">
            경험치 {exp}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
