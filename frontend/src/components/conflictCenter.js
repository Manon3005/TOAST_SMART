import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import { FinTraitementButton } from "./finTraitementButton";

import React, { useState } from 'react';
import '../App.css';



export function ConflictCenter({ student , onAccept, onRefuse, disabled, fin, onFin, load }) { 

    if (load){
        return React.createElement('div', { className: 'loading-container' },
            React.createElement('img', {
                src: 'img/loading.gif',
                alt: 'Chargement...',
                className: 'spinner'
            }),
            React.createElement('p', null, 'Chargement en cours...')
        );
    }
    
    
    if (fin) {
        return React.createElement('div',null,
            React.createElement('h3', null, 'Traitement terminé'),
            React.createElement(FinTraitementButton, {onClick: onFin, disabled:disabled}),
        );  
    }


    return React.createElement('div', null,
    React.createElement('p', null, 
        React.createElement('strong', null, 'Nombre de conflits restants : '),
        student.remainingConflictNumber
    ),
    React.createElement('p', null, 
        React.createElement('strong', null, '🎓 Diplômé.e : '),
        `${student.firstName} ${student.lastName}`
    ),
    React.createElement('p', null, 
        React.createElement('strong', null, 'Préférences indiquées : '),
        student.neighboursEntry
    ),
    React.createElement('p', null, 
        React.createElement('strong', null, '👤 Voisin.e proposé.e : '),
        `${student.conflict?.firstName} ${student.conflict?.lastName}`
    ),
    React.createElement('div', { className: 'conflict-container-buttons' },
        React.createElement('button', { className: 'classic-button', onClick: onAccept }, 'Accepter'),
        React.createElement('button', { className: 'classic-button', onClick: onRefuse }, 'Refuser')
    ),
    
);
}
