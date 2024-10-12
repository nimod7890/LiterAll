import LoadListLottie from "@assets/lottie-home.json";
import Lottie from "react-lottie";
export default function PendingContainer({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="m-auto flex h-screen w-screen flex-col items-center justify-center"
    >
      <Lottie
        options={{ animationData: LoadListLottie, loop: true, autoplay: true }}
        style={{ marginTop: "-100px", marginBottom: "-100px" }}
        height={"500px"}
      />
      <div className="flex flex-col items-center gap-5">
        <h4>{message}</h4>
        <p>잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}
