import { Progress } from "@components/ui/progress";
import useGetUserInfo from "@hooks/useGetUserInfo";
import { useMemo } from "react";

export default function MyExp() {
  const { userInfo } = useGetUserInfo();
  const { name, exp } = userInfo;

  const { level, currentExp } = useMemo(
    () => ({
      level: Math.floor(exp / 100),
      currentExp: exp % 100,
    }),
    [exp],
  );
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <p className="min-w-max font-medium text-detail-3 mr-1 text-gray-700">나는 지금</p>
      <p className="text-purple-500 font-bold text-detail-2">Lv. {level}</p>
      <Progress value={currentExp} className="w-[100px]" />
    </div>
  );
}
