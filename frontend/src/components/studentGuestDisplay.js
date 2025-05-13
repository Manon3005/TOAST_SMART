import React, { useState } from 'react';
import '../App.css';



export function StudentGuestDisplay({conflict}) {
  if (!conflict || Object.keys(conflict).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  const sectionTitle = (text, className = "section-title") =>
    React.createElement('h3', { className }, text);

  const paragraph = (label, value, className = "info-line") =>
    React.createElement('p', { className },
      React.createElement('strong', null, label + ': '),
      value
    );

  const listItems = (items, getText, className = "list") =>
    React.createElement('ul', { className },
      items.map((item, i) =>
        React.createElement('li', { key: i, className: "list-item" }, getText(item))
      )
    );

  return React.createElement('div', { className: "student-container" }, [
    React.createElement('h2', { className: "student-title" }, "Résumé de l'étudiant"),

    paragraph('Nom', conflict.lastName),
    paragraph('Prénom', conflict.firstName),

    sectionTitle('Invités'),
    Array.isArray(conflict.guests) && conflict.guests.length > 0
      ? listItems(conflict.guests, g => `${g.guestFirstName} ${g.guestLastName}`)
      : React.createElement('p', { className: "empty-msg" }, 'Aucun invité 😂🫵.'),

    sectionTitle('Voisins'),
    Array.isArray(conflict.processedNeighbours) && conflict.processedNeighbours.length > 0
      ? listItems(conflict.processedNeighbours, n => `${n.neighbourFirstName} ${n.neighbourLastName}`)
      : React.createElement('p', { className: "empty-msg" }, 'Aucun voisin.')
  ]);

}