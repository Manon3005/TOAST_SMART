import React, { useState } from 'react';
import '../../styles/App.css'


export function InputPlanButton({disabled, nameFile, setName, errorFile, setErrorFile, onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'imput-plan-button-container' },
      React.createElement(
          'button',
          { onClick: onClick, className: 'classic-button', disabled : disabled},'📁 Importer une solution' ),
    ),
);
}