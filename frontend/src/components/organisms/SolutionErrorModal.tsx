import { Rapport } from "../../types/Rapport";
import { Button } from "../atoms/Button";

export const SolutionErrorModal = ({
  handleOnClickCloseModal,
  rapport,
}: {
  handleOnClickCloseModal: () => void;
  rapport: Rapport;
}) => {
  return (
    <div
      className="absolute inset-0 flex w-full h-full justify-center items-center bg-black/50 z-1"
      onClick={handleOnClickCloseModal}
    >
      <div className="max-w-[400px] w-[80%] flex flex-col items-center p-[30px] bg-white rounded-[15px] custom-shadow gap-[10px]">
        <h2 className="text-black font-bold text-[24px]">
          Erreur dans la génération !
        </h2>
        <p className="text-black text-center font-[16px]">{`Nombre de tables manquantes : ${rapport.nb_table_missing}`}</p>
        <p className="text-black text-center font-[16px]">{`Nombre d'étudiants sans table : ${rapport.nb_student_without_table}`}</p>
        <p className="text-black text-center font-[16px]">{`Nombre de tables en trop dans la solution : ${rapport.extra_table}`}</p>
        <Button
          className="bg-[#4caf50] hover:bg-[#45a049] rounded-[5px] px-[20px] py-[10px] text-white text-[16px] cursor-pointer"
          onClick={handleOnClickCloseModal}
          text="Fermer"
        ></Button>
      </div>
    </div>
  );
};
