import React from 'react';
import '../App.css';

export function StatCenter({ nameFile, finalAddress, statsJson }) {
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
        React.createElement('div', null,
            React.createElement('p', null, 'Pourcentage d\'étudiants satisfaits : '),
            React.createElement('p', null, 'Nombre de demandes possibles : '),
            React.createElement('p', null, 'Nombre de demandes satisfaites : '),
            React.createElement('p', null, 'Nombre de tables utilisées : '),
            React.createElement('p', null, 'Nombre moyen de convives par table : ')
        )
    );
    }
    
}
