import PendingContainer from "@components/layout/pending/PendingContainer";
import DeferredWrapper from "src/components/common/DeferredWrapper.tsx";

export default function GlobalFallback() {
  return (
    <DeferredWrapper>
      <PendingContainer message="페이지 정보를 불러오는 중입니다" />
    </DeferredWrapper>
  );
}
