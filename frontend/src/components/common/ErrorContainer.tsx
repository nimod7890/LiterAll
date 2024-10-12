import { Button } from "@components/ui/button";

interface ErrorFallbackProps {
  errorMessage: string;
  reset: () => void;
}

export default function ErrorContainer({ errorMessage, reset }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex pt-10 h-screen w-screen flex-col items-center justify-content"
    >
      {/* <img src="/images/fcfs/result/wrong.webp" alt="오류 발생 이미지" /> */}
      <div className="flex flex-col items-center gap-5">
        <h4>{errorMessage}</h4>
        <Button onClick={reset}>홈으로 돌아가기</Button>
      </div>
    </div>
  );
}
