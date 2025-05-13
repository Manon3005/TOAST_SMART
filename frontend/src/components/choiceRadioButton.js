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
    React.createElement(
      'p',
      null,
      React.createElement('label', null,
        React.createElement('input', {
          type: 'radio',
          value: 'min_table',
          checked: selectedValue === 'min_table',
          onChange: handleChange,
        }),
        'Minimiser le nombre de tables'
      )
    ),
    React.createElement(
      'p',
      null,
      React.createElement('label', null,
        React.createElement('input', {
          type: 'radio',
          value: 'max_demand',
          checked: selectedValue === 'max_demand',
          onChange: handleChange,
        }),
        'Favoriser le nombre de demandes satisfaites'
      )
    ),
    React.createElement(
      'p',
      null,
      React.createElement('label', null,
        React.createElement('input', {
          type: 'radio',
          value: 'max_student',
          checked: selectedValue === 'max_student',
          onChange: handleChange,
        }),
        'Favoriser le nombre d\'étudiants satisfaits' 
      )
    ),
    React.createElement(
      'p',
      null,
      React.createElement('label', null,
        React.createElement('input', {
          type: 'radio',
          value: 'less_guest',
          checked: selectedValue === 'less_guest',
          onChange: handleChange,
        }),
        'Satisfaire en priorité les étudiants avec le moins d\'invités'
      )
    )
  );
}