import { Paragraph } from "../atoms/Paragraph";

export const SupportText = ({}: {}) => {
  return (
    <div className="w-[80%] flex flex-col justify-start items-center p-[20px] gap-[10px] bg-white rounded-[12px] custom-shadow">
      <div className="w-full flex flex-col justify-center gap-[10px]">
        <Paragraph>
          Ce projet a été réalisé dans le cadre du projet SMART par un groupe
          d'étudiants de 4ème année du département Informatique de l'INSA Lyon.
        </Paragraph>
        <Paragraph>
          Contributeurs : Manon Bertrand, Royce Cho, Aodren Pitard-Bouet, Adrien
          Doan, Mathis Getenet, Armand Brunet et Aubin Roche
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
  );
};
