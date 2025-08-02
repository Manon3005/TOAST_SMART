import { ReactNode } from "react";

export const ExplainText = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-[80%] flex flex-row items-center justify-center bg-white p-[50px] rounded-[20px] custom-shadow">
      <div className="w-full">{children}</div>
    </div>
  );
};
