import { ReactNode } from "react";

export const Paragraph = ({ children }: { children: ReactNode }) => {
  return <p className="text-justify">{children}</p>;
};
