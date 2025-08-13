import { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-[40px] font-bold text-black">{children}</h1>
    </div>
  );
};
