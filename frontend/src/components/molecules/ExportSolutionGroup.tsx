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
    <div className="export-button-container">
      <Button
        onClick={onClick}
        className="classic-button"
        disabled={disabled}
        text="Exporter le plan de table"
      />
      {fileName && (
        <div className="file-message-text">
          {isError && <p style={{ color: "red" }}>{fileName}</p>}
          {!isError && <p>📄 {fileName}</p>}
        </div>
      )}
    </div>
  );
};
