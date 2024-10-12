import LitUp from "@components/common/LitUp";
import LinkUpload from "@components/layout/litup/LinkUpload";
import TextUpload from "@components/layout/litup/TextUpload";
import { Separator } from "@components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@components/ui/sheet";
import useAuth from "@hooks/useAuth";

export default function LitUpButton() {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="flex flex-row items-center justify-center ">
        <p className="text-detail-3 text-gray-600 mr-1">나만의 문제로</p>
        <LitUp />
        <p className="text-detail-3 text-gray-600">하러가기</p>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[640px]">
        <SheetHeader className="my-5">
          <SheetTitle className="flex flex-row items-center gap-3 mb-3">
            <p className="text-body-1 font-medium">나만의 문제로</p>
            <LitUp fontSize="text-heading-10" />
          </SheetTitle>
          <SheetDescription>
            원하는 뉴스 기사의 링크를 업로드하거나,
            <br />
            기사 전문을 복사해서 붙여넣으면 맞춤형 문제가 뚝딱 만들어져요!
            <br />
            AI가 {user?.name ?? "사용자"}님을 위해 기사를 똑똑하게 분석해서 <br />
            독해력을 쑥쑥 높여줄 다양한 질문을 만들어 줄 거예요.
            <br />
            <br />
            지금 바로 시작해 보세요!
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col my-12 gap-12">
          <LinkUpload />
          <TextUpload />
        </div>
      </SheetContent>
    </Sheet>
  );
}
