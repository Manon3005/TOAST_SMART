import React, { useState } from 'react';
import '../App.css';



export function GenerateButton({onClick, disabled = false}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'file-button' },'Générer le plan de table' )
);
}