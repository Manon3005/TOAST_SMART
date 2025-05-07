import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import React, { useState } from 'react';
import '../App.css';


export function Home() {
    return React.createElement(
        'div',
        { className: 'app-container', style: { padding: '20px', fontFamily: 'sans-serif' } },
        React.createElement('h1', null, '🍞 TOAST 🍞'),
        React.createElement('p', null, 'Tous à sa table'),
        React.createElement(FileButton, {className: 'file-button'},'📁 Charger un fichier' ),
        React.createElement(InputNumber, null,'Nombre max de convives par table' ),
    );
}