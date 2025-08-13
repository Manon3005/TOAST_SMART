import { Button } from "../atoms/Button";

export const ConflictsHeaderButton = ({
  remainingConflictNumber,
  handleContinue,
  handleRefuseAllConflicts,
}: {
  remainingConflictNumber: number;
  handleContinue: () => void;
  handleRefuseAllConflicts: () => void;
}) => {
  return remainingConflictNumber === 0 ? (
    <Button
      onClick={handleContinue}
      text="Continuer et générer le fichier intermédiaire"
    />
  ) : (
    <Button
      onClick={handleRefuseAllConflicts}
      text="⛔ Passer tous les conflits restants"
    />
  );
};
