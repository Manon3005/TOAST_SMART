import React, { useState } from 'react';
import '../../styles/App.css'



export function ContinueButton({onClick, disabled}) {


  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick : onClick, className: 'continue-button', disabled : disabled },'Valider' )
  );
}