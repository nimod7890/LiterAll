import Logo from "@components/layout/Logo";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@components/ui/sheet";

export default function LitUpButton() {
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row items-center justify-center ">
        <p className="text-detail-3 text-gray-600 mr-1">나만의 문제로</p>
        <p className="font-extrabold text-detail-2 text-orange-400">Lit</p>
        <p className="font-extrabold text-detail-2 text-lime-500 mr-2">UP!</p>
        <p className="text-detail-3 text-gray-600">하러가기</p>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>
            <div className="flex flex-row items-center gap-3">
              <p className="text-body-2 font-medium mt-2">나만의 문제로</p> <Logo />
            </div>
          </SheetTitle>
          <SheetDescription>
            원하는 뉴스 기사의 링크를 업로드하거나,
            <br />
            기사 전문을 복사해서 붙여넣으면 맞춤형 문제가 뚝딱 만들어져요!
            <br />
            AI가 기사를 똑똑하게 분석해서 독해력을 쑥쑥 높여줄 다양한 질문을 만들어 줄 거예요.
            <br />
            <br />
            지금 바로 시작해 보세요!
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
