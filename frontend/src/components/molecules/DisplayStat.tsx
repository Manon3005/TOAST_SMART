import '../../styles/App.css';
import { StatsJson } from '../../types/StatsJson';

export const DisplayStat = ({
  nameFile, 
  finalAddress, 
  statsJson,
} : {
  nameFile: string,
  finalAddress: string,
  statsJson: StatsJson
}) => {
  const shouldDisplayMessage = !nameFile && !finalAddress;

  if (shouldDisplayMessage) {
    return (
      <div className="stats-center">
        <p>Aucune stat disponible pour le moment</p>
      </div>
    );
  }

  if (statsJson) {
    return (
      <div className="stats-center">
        <h3>Statistiques</h3>
        <div className="stats-container">
          <p>Pourcentage d'étudiants satisfaits : {Number(statsJson.percentage_student_satisfied).toFixed(2)} %</p>
          <p>Nombre de demandes possibles : {statsJson.nb_possible_demand}</p>
          <p>Nombre de demandes satisfaites : {statsJson.nb_satisfied_demand}</p>
          <p>Nombre de tables utilisées : {statsJson.nb_used_tables}</p>
          <p>Nombre moyen de convives par table : {Number(statsJson.mean_guest_by_table).toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return null;
}

