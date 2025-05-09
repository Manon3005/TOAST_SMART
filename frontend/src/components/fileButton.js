import React, { useState } from 'react';
import '../App.css';



export function FileButton({disabled, nameFile, setName, errorFile, setErrorFile, onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'file-button-container' },
      React.createElement(
          'button',
          { onClick: onClick, className: 'file-button', disabled : disabled},'📁 Charger un fichier' ),
      
      React.createElement('div', { className: 'file-message-text' },
        errorFile && React.createElement('p', { style: { color: 'red' } }, errorFile),
        nameFile && React.createElement('p', null, '📄 ' + nameFile)
      )
    ),
);
}
