import React, { useState } from 'react';
import '../App.css';



export function AddStudentManual({ label, listStudent, value, onChange, disabled }) {
  return React.createElement(
    'div',
    { className: 'dropdown' },
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
        ...listStudent.map((student) =>
          React.createElement(
            'option',
            { key: student.id, value: student.id },
            `${student.firstName}  ${student.lastName}`
          )
        )
      ]
    )
  );
}