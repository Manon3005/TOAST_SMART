import React, { useState } from 'react';
import '../../styles/App.css'


export function RefuseAllConflictsButton({onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        {className: 'classic-button', onClick : onClick },' ⛔ Passer tous les conflits restants' )
);
}