import { PropsWithChildren } from "react";

type ContainerProps = { title: string };

export default function Container({ title, children }: PropsWithChildren<ContainerProps>) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-detail-1 font-neutral">{title}</p>
      {children}
    </div>
  );
}
