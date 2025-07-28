import '../../styles/App.css';
import { StatsJson } from '../../types/StatsJson';

export const StatsCenter = ({ 
        data 
    } : {
        data : StatsJson | null
    }) => {

    if (!data) {
        return (
            <div className="stats-center">
                <p>Aucune stat disponible pour le moment</p>
            </div>
        );
    }

    return (
    <div className="stats-center">
        <h3>Statistiques</h3>
        <div className="stats-container">
            <p>Pourcentage d'étudiants satisfaits : {Number(data.percentage_student_satisfied).toFixed(2)} %</p>
            <p>Nombre de demandes possibles : {data.nb_possible_demand}</p>
            <p>Nombre de demandes satisfaites : {data.nb_satisfied_demand}</p>
            <p>Nombre de tables utilisées : {data.nb_used_tables}</p>
            <p>Nombre moyen de convives par table : {Number(data.mean_guest_by_table).toFixed(2)}</p>
        </div>
    </div>
    );
}
