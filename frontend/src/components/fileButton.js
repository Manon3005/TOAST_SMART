import React, { useState } from 'react';
import '../App.css';



export function FileButton({disabled, nameFile, setName, errorFile, setErrorFile}) {
    //Variable Initilization
    const [filePath, setPath] = useState(''); 
    
    //fonction to load a file and get his path
    const loadFile = async () => {
        try {
            const filePath = await window.electronAPI.pickFile();
            if (!filePath.endsWith('.csv')) {
                setErrorFile('Veuillez sélectionner un fichier .csv');
                return;
            }
            
            const name = filePath.split(/[/\\]/).pop();
            setName(name);
            setPath(filePath);
            setErrorFile('');
        } catch (err) {
            setErrorFile('Erreur chargement du fichier');
            setPath('');
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick: loadFile, className: 'file-button', disabled : disabled},'📁 Charger un fichier' ),
    errorFile && React.createElement('p', { style: { color: 'red' } }, errorFile),
    nameFile && React.createElement('p', null, '📄 ' + nameFile)
);
}
