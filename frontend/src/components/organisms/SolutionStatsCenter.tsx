import { StatsJson } from "../../types/StatsJson";
import { Paragraph } from "../atoms/Paragraph";
import { SubTitle } from "../atoms/SubTitle";

export const SolutionStatsCenter = ({ data }: { data: StatsJson | null }) => {
  return data ? (
    <div className="flex flex-col items-center">
      <SubTitle>Statistiques</SubTitle>
      <div className="flex flex-col items-start gap-[10px]">
        <Paragraph>
          Pourcentage d'étudiants satisfaits :{" "}
          {Number(data.percentage_student_satisfied).toFixed(2)} %
        </Paragraph>
        <Paragraph>
          Nombre de demandes possibles : {data.nb_possible_demand}
        </Paragraph>
        <Paragraph>
          Nombre de demandes satisfaites : {data.nb_satisfied_demand}
        </Paragraph>
        <Paragraph>
          Nombre de tables utilisées : {data.nb_used_tables}
        </Paragraph>
        <Paragraph>
          Nombre moyen de convives par table :{" "}
          {Number(data.mean_guest_by_table).toFixed(2)}
        </Paragraph>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <Paragraph>Aucune stat disponible pour le moment</Paragraph>
    </div>
  );
};
