import React, { useState } from 'react';
import '../App.css';



export function ResetButton({onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'file-button' },'Annuler' )
);
}