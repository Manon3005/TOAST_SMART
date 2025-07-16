import React, { useState } from 'react';
import '../../styles/App.css'



export function GenerateButton({onClick, disabled = false}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'classic-button' },'Générer la solution' )
);
}