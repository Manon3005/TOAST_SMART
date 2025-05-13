import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import React, { useState } from 'react';
import { GenerateButton } from "../components/generateButton";
import '../App.css';



export function ConflictCenter({ student , onAccept, onRefuse, disabled, fin, onGenerate }) { 

    if (fin) {
        return React.createElement('div',null,
            React.createElement('p', null, 'Traitement terminé'),
            React.createElement(GenerateButton, {className: 'file-button', onClick: onGenerate}),
        );  
    }
    if (!student) {
        return React.createElement('p', null, 'Aucun conflit à traiter');
    }

    return React.createElement('div', null,
    React.createElement('p', null, `🎓 Diplômé.e : ${student.firstName} ${student.lastName}`),
    React.createElement('p', null, `Préférences initiales : ${student.neighboursEntry}`),
    React.createElement('p', null, `👤 Voisin.e proposé.e : ${student.conflict.neighbourFirstName} ${student.conflict.neighbourLastName}`),
    React.createElement('div', null,
        React.createElement('button', { onClick: onAccept, disabled }, 'Accepter'),
        React.createElement('button', { onClick: onRefuse, disabled }, 'Refuser')
    ),
    React.createElement('p', null, `Nombre de conflits restants : ${student.remainingConflictNumber}`)
    );
}
