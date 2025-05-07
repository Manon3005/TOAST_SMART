import React, { useState } from 'react';



export function FileButton() {
    //Variable Initilization
    const [filePath, setPath] = useState(''); 
    const [nameFile, setName] = useState(''); 
    const [error, setError] = useState('');
    
    //useState retourne une paire : la valeur de l’état actuel et une fonction qui vous permet de la mettre à jour (similaire à this.setState)

    //fonction to load a file and get his path
    const loadFile = async () => {
        try {
        const filePath = await window.electronAPI.pickFile();
        if (!filePath.endsWith('.csv')) {
            setError('Veuillez sélectionner un fichier .csv');
            return;
        }
        const nameFile = filePath.split('\\').pop();
        setName(nameFile);
        setPath(filePath);
        setError('');
        } catch (err) {
        setError('Erreur chargement du fichier');
        setPath('');
    }
  };
}
