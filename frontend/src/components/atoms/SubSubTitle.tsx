import { ReactNode } from "react";

export const SubSubTitle = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-[1.2rem] text-black font-bold">{children}</h3>;
};
