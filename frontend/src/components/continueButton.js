import React, { useState } from 'react';
import '../App.css';



export function ContinueButton({onClick, disabled}) {


  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'file-button', disabled : disabled },'Valider' )
  );
}