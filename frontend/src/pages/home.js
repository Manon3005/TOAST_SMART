import { FileButton } from "../components/fileButton";
import React, { useState } from 'react';

export function Home() {
    return React.createElement(
        'div',
        { className: 'app-container', style: { padding: '20px', fontFamily: 'sans-serif' } },
        React.createElement('h1', null, '🍞 TOAST 🍞'),
        React.createElement('p', null, 'Tous à sa table'),
        //React.createElement(FileButton,{ onClick: loadFile },'📁 Charger un fichier' ),
        //error && React.createElement('p',null,error),
        //nameFile && React.createElement('p',null,'📄 ' + nameFile)
    );
}