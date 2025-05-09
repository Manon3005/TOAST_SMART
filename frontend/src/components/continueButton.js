import React, { useState } from 'react';
import '../App.css';



export function ContinueButton({onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'continue-button' },'Continuer' )
);
}