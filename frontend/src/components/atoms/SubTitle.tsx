import { ReactNode } from "react";

export const SubTitle = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="w-full text-black text-[18px] text-center font-bold">
      {children}
    </h2>
  );
};
