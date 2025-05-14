import React, { useState } from 'react';
import '../App.css';

export function ChoiceRadioButton({ onSelectionChange }) {
  const [selectedValue, setSelectedValue] = useState('max_demand');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (onSelectionChange) {
      onSelectionChange(event.target.value);
    }
  };

  return React.createElement(
    'div',
    { className: 'radio-group' },
    ['min_table', 'max_demand', 'max_student', 'less_guest'].map((value, index) => {
      const labels = {
        'min_table': 'Minimiser le nombre de tables',
        'max_demand': 'Favoriser le nombre de demandes satisfaites',
        'max_student': 'Favoriser le nombre d\'étudiants satisfaits',
        'less_guest': 'Satisfaire en priorité les étudiants avec le moins d\'invités',
      };
      return React.createElement(
        'div',
        { key: index, className: 'radio-option' },
        React.createElement('input', {
          type: 'radio',
          value: value,
          checked: selectedValue === value,
          onChange: handleChange,
          id: value,
        }),
        React.createElement('label', { htmlFor: value }, labels[value])
      );
    })
  );
}