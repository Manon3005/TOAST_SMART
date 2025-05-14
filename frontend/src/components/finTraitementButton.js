import React, { useState } from 'react';
import '../App.css';



export function FinTraitementButton({onClick, disabled}) {


  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'classic-button', disabled : disabled },'Fin traitement' )
  );
}