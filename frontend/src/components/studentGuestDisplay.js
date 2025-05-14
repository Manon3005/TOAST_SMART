import React, { useState } from 'react';
import '../App.css';



export function StudentGuestDisplay({student}) {
  if (!student || Object.keys(student).length === 0) {
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

    paragraph('Nom', student.lastName),
    paragraph('Prénom', student.firstName),

    sectionTitle('Invités'),
    Array.isArray(student.guests) && student.guests.length > 0
      ? listItems(student.guests, g => `${g.guestFirstName} ${g.guestLastName}`)
      : React.createElement('p', { className: "empty-msg" }, 'Aucun invité 😂🫵.'),

    sectionTitle('Voisins'),
    Array.isArray(student.processedNeighbours) && student.processedNeighbours.length > 0
      ? listItems(student.processedNeighbours, n => `${n.neighbourFirstName} ${n.neighbourLastName}`)
      : React.createElement('p', { className: "empty-msg" }, 'Aucun voisin.')
  ]);

}