import React, { useState } from 'react';
import '../App.css';



export function FileButton({disabled, nameFile, setName, errorFile, setErrorFile, onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick: onClick, className: 'file-button', disabled : disabled},'📁 Charger un fichier' ),
    errorFile && React.createElement('p', { style: { color: 'red' } }, errorFile),
    nameFile && React.createElement('p', null, '📄 ' + nameFile)
);
}
