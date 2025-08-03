import { Button } from "../atoms/Button";

export const SupportSecretModal = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    isModalOpen && (
      <div
        className="absolute inset-0 flex w-full h-full justify-center items-center bg-black/50 z-1"
        onClick={closeModal}
      >
        <div className="max-w-[400px] w-[80%] flex flex-col items-center p-[30px] bg-white rounded-[15px] custom-shadow gap-[10px]">
          <h2 className="text-black font-bold text-[24px]">Félicitations !</h2>
          <p className="text-black text-center font-[16px]">
            Notre algorithme de placement est maintenant 235% plus performant !
          </p>
          <Button
            className="bg-[#4caf50] hover:bg-[#45a049] rounded-[5px] px-[20px] py-[10px] text-white text-[16px] cursor-pointer"
            onClick={closeModal}
            disabled={false}
            text="Fermer"
          />
        </div>
      </div>
    )
  );
};
