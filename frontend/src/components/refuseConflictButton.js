import React, { useState } from 'react';
import '../App.css';



export function RefuseConflictButton({onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        {className: 'file-button', onClick : onClick },'🗸' )
);
}