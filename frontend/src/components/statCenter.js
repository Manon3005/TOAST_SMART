import React from 'react';
import '../App.css';

export function StatCenter({ nameFile, finalAddress, statsJson, rapportJson, onCloseRapport }) {
    const shouldDisplayMessage = !nameFile && !finalAddress;

    if (shouldDisplayMessage) {
        return React.createElement(
            'div',
            { className: 'stats-center' },
            React.createElement('p', null, 'Aucune stat disponible pour le moment')
        );
    }

    if (statsJson) {
        return React.createElement(
            'div',
            { className: 'stats-center' },
            React.createElement('h3', null, 'Statistiques'),
            React.createElement('div', { className: 'stats-container' },
                React.createElement('p', null, `Pourcentage d'étudiants satisfaits : ${Number(statsJson.percentage_student_satisfied).toFixed(2)} %`),
                React.createElement('p', null, `Nombre de demandes possibles : ${statsJson.nb_possible_demand}`),
                React.createElement('p', null, `Nombre de demandes satisfaites : ${statsJson.nb_satisfied_demand}`),
                React.createElement('p', null, `Nombre de tables utilisées : ${statsJson.nb_used_tables}`),
                React.createElement('p', null, `Nombre moyen de convives par table : ${Number(statsJson.mean_guest_by_table).toFixed(2)}`),
            )
        );
    }

    return null;
}
