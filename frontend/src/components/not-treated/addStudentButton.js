import React, { useState } from 'react';
import '../../styles/App.css'



export function AddStudentButton({onClick}) {

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        {className: 'classic-button', onClick : onClick },' ✚ Ajouter voisin' )
);
}