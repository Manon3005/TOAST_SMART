import { useState } from "react";
import { Title } from "../components/atoms/Title";
import { SupportText } from "../components/molecules/SupportText";
import { SupportSecretModal } from "../components/organisms/SupportSecretModal";
export function Support() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col items-center gap-[20px] my-[20px]">
      <Title>Support</Title>
      <SupportText />
      <img
        alt="Toaster"
        className="w-[200px] h-[200px] rounded-[12px]"
        src="img/Logo TOAST.png"
        useMap="#toastmap"
      />
      <map name="toastmap">
        <area
          shape="rect"
          coords="150,110,180,130"
          onClick={openModal}
          alt="Easter Egg"
        />
      </map>
      {isModalOpen && <SupportSecretModal closeModal={closeModal} />}
    </div>
  );
}
