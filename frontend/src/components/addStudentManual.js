import React, { useState } from 'react';
import '../App.css';



export function AddStudentManual({ label, listStudent, value, onChange, disabled }) {
  const sortedStudents = [...listStudent].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );
  return React.createElement(
    'div',
    { className: 'select-row' },
    React.createElement('label', null, label),
    React.createElement(
      'select',
      {
        value: value,
        onChange: (e) => onChange(e.target.value),
        disabled: disabled
      },
      [
        React.createElement('option', { key: '-1', value: '--selectionnez--' }, '--Sélectionnez--'),
        ...sortedStudents.map((student) =>
          React.createElement(
            'option',
            { key: student.id, value: student.id },
            `${student.lastName}  ${student.firstName}`
          )
        )
      ]
    )
  );
}