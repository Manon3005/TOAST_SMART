import { Button } from "../atoms/Button";

export const ExportSolutionGroup = ({
  onClick,
  disabled,
  fileName,
  isError,
}: {
  onClick: () => void;
  disabled: boolean;
  fileName?: string;
  isError: boolean;
}) => {
  return (
    <div className="flex flex-col justify-end items-center gap-[20px]">
      <Button
        onClick={onClick}
        disabled={disabled}
        text="Exporter le plan de table"
      />
      {fileName &&
        (isError ? (
          <p className="text-red-500"> {fileName}</p>
        ) : (
          <p className="text-black">📄 {fileName}</p>
        ))}
    </div>
  );
};
