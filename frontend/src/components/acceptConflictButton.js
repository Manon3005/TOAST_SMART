import React, { useState } from 'react';
import '../App.css';



export function AcceptConflictButton() {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        {className: 'file-button' },'✗' )
);
}