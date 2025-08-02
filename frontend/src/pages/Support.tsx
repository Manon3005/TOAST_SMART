import React, { useState } from "react";
import { Button } from "../components/atoms/Button";
import { Paragraph } from "../components/atoms/Paragraph";
export function Support() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col items-center gap-[20px] my-[20px]">
      <div className="flex flex-col items-center justify-start">
        <h1 className="text-[40px] font-bold text-black">Support</h1>
      </div>
      <div className="w-[80%] flex flex-col justify-start items-center p-[20px] gap-[10px] bg-white rounded-[12px] custom-shadow">
        <div className="w-full flex flex-col justify-center gap-[10px]">
          <Paragraph>
            Ce projet a été réalisé dans le cadre du projet SMART par un groupe
            d'étudiants de 4ème année du département Informatique de l'INSA
            Lyon.
          </Paragraph>
          <Paragraph>
            Contributeurs : Manon Bertrand, Royce Cho, Aodren Pitard-Bouet,
            Adrien Doan, Mathis Getenet, Armand Brunet et Aubin Roche
          </Paragraph>
          <Paragraph>
            Pour toute question ou problème, n'hésitez pas à nous contacter à
            l'adresse suivante : manon.bertrand@insa-lyon.fr
          </Paragraph>
          <Paragraph>
            Vous pouvez également consulter notre dépôt GitHub pour plus
            d'informations sur le projet : https://github.com/Manon3005/TOAST
          </Paragraph>
        </div>
      </div>
      <img
        className="w-[200px] h-[200px] rounded-[12px]"
        src="img/Logo TOAST.png"
        useMap="#toastmap"
      />
      <map name="toastmap">
        <area shape="rect" coords="150,110,180,130" onClick={openModal} />
      </map>

      {isModalOpen && (
        <div
          className="absolute inset-0 flex w-full h-full justify-center items-center bg-black/50 z-1"
          onClick={closeModal}
        >
          <div className="max-w-[400px] w-[80%] flex flex-col items-center p-[30px] bg-white rounded-[15px] custom-shadow gap-[10px]">
            <h2 className="text-black font-bold text-[24px]">
              Félicitations !
            </h2>
            <p className="text-black text-center font-[16px]">
              Notre algorithme de placement est maintenant 235% plus performant
              !
            </p>
            <Button
              className="bg-[#4caf50] hover:bg-[#45a049] rounded-[5px] px-[20px] py-[10px] text-white text-[16px] cursor-pointer"
              onClick={closeModal}
              disabled={false}
              text="Fermer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
