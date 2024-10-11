type LogoType = {
  size?: "sm" | "default";
};
export default function Logo({ size = "default" }: LogoType) {
  return (
    <p
      className={`font-extrabold ${size == "default" ? "text-body-1 mt-3" : "text-detail-2 mt-1"}  flex flex-row`}
    >
      <span className={size == "default" ? "text-orange-400" : "text-orange-400"}>Lit</span>
      <span className={size == "default" ? "font-medium text-orange-400" : "text-orange-400"}>
        er
      </span>
      <span className={size == "default" ? "text-lime-500" : "text-lime-500"}>Al!</span>
    </p>
  );
}
