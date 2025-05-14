import React, { useState } from 'react';
import '../App.css';



export function InputPlanButton({disabled, nameFile, setName, errorFile, setErrorFile, onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'imput-plan-button-container' },
      React.createElement(
          'button',
          { onClick: onClick, className: 'classic-button', disabled : disabled},'📁 Importer une solution' ),
      
      React.createElement('div', { className: 'file-message-text' },
        errorFile && React.createElement('p', { style: { color: 'red' } }, errorFile),
        nameFile && React.createElement('p', null, '📄 ' + nameFile)
      )
    ),
);
}