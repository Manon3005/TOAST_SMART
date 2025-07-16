import React, { useState } from 'react';
import '../../styles/App.css'



export function FinTraitementButton({onClick, disabled}) {


  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'classic-button'},'Fin traitement' )
  );
}