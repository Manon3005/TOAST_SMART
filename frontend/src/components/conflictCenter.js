import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import { FinTraitementButton } from "./finTraitementButton";

import React, { useState } from 'react';
import '../App.css';



export function ConflictCenter({ student , onAccept, onRefuse, disabled, fin, onFin }) { 

    if (fin) {
        return React.createElement('div',null,
            React.createElement('p', null, 'Traitement terminé'),
            React.createElement(FinTraitementButton, {onClick: onFin, disabled:disabled}),
        );  
    }


    return React.createElement('div', null,
    React.createElement('p', null, `🎓 Diplômé.e : ${student.firstName} ${student.lastName}`),
    React.createElement('p', null, `Préférences initiales : ${student.neighboursEntry}`),
    React.createElement('p', null, `👤 Voisin.e proposé.e : ${student.conflict?.firstName} ${student.conflict?.lastName}`),
    React.createElement('div', null,
        React.createElement('button', { onClick: onAccept }, 'Accepter'),
        React.createElement('button', { onClick: onRefuse }, 'Refuser')
    ),
    React.createElement('p', null, `Nombre de conflits restants : ${student.remainingConflictNumber}`)
    );
}
