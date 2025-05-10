import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import React, { useState } from 'react';
import '../App.css';



export function ConflictCenter({ students = [], currentStudentIndex = 0, currentNeighbourIndex = 0, onAccept, onRefuse,disabled }) { 
    const student = students[currentStudentIndex];
    const neighbour = student?.processedNeighbours?.[currentNeighbourIndex];

    if (!student) {
        return React.createElement('p', null, 'Aucun conflit à traiter');
    }
    if (!neighbour){
        return React.createElement('div',null,
            React.createElement('p', null, 'Pas de voisin.e pour ce diplomé.e'),
            React.createElement('button', { onClick: onAccept, disabled }, 'Suivant'),
        );
    }

    return React.createElement('div', null,
    React.createElement('p', null, `🎓 Diplômé.e : ${student.firstName} ${student.lastName}`),
    React.createElement('p', null, `👤 Voisin.e proposé.e : ${neighbour.neighbourFirstName} ${neighbour.neighbourLastName}`),
    React.createElement('div', null,
        React.createElement('button', { onClick: onAccept, disabled }, 'Accepter'),
        React.createElement('button', { onClick: onRefuse, disabled }, 'Refuser')
    ),
    React.createElement('p', null, `Cas ${currentStudentIndex + 1}/${students.length} - Voisin ${currentNeighbourIndex + 1}/${student.processedNeighbours.length}`)
    );
}