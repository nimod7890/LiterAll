import { Progress } from "@components/ui/progress";
import useGetUserInfo from "@hooks/useGetUserInfo";

export default function MyExp() {
  const { userInfo } = useGetUserInfo();
  const { name, exp } = userInfo;

  return (
    <div>
      {name}의 리터러시 <Progress value={exp} />
    </div>
  );
}
