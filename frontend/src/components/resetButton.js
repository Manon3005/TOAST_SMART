import React, { useState } from 'react';
import '../App.css';



export function ResetButton({onClick, disabled}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'reset-button', disabled : disabled},'Annuler' )
);
}