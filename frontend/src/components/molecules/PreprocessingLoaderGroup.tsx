import { Button } from "../atoms/Button";

export const PreprocessingLoaderGroup = ({
  loadFile,
  errorMessage,
  nameFile,
}: {
  loadFile: () => void;
  errorMessage: string;
  nameFile: string;
}) => {
  return (
    <div className="flex justify-center items-center gap-[20px]">
      <Button onClick={loadFile} text="📁 Charger un fichier" />
      {errorMessage !== "" && <p style={{ color: "red" }}>{errorMessage}</p>}
      {nameFile !== "" && <p style={{ color: "green" }}>{nameFile}</p>}
    </div>
  );
};
