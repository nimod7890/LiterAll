type LitUpProps = { fontSize?: string };

export default function LitUp({ fontSize = "text-detail-2" }: LitUpProps) {
  return (
    <div className="flex flex-row items-center justify-center mt-1">
      <p className={`font-extrabold ${fontSize} text-orange-400`}>Lit</p>
      <p className={`font-extrabold ${fontSize} text-lime-500 mr-2`}>UP!</p>
    </div>
  );
}
