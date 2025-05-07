
import './App.css';

import React, { useState } from 'react';

function App() {
  //initialisation des varaibles à vide
  const [filePath, setPath] = useState(''); 
  const [error, setError] = useState('');
  //useState retourne une paire : la valeur de l’état actuel et une fonction qui vous permet de la mettre à jour (similaire à this.setState)

  //fonction pour charger un fichier et récupérer son chemin
  const loadFile = async () => {
    try {
      const filePath = await window.electronAPI.pickFile();
      if (!filePath.endsWith('.csv')) {
        setError('Veuillez sélectionner un fichier .csv');
        return;
      }
      setPath(filePath);
      setError('');
    } catch (err) {
      setError('Erreur chargement du fichier');
      setPath('');
    }
  };

  return React.createElement(
    'div',
    { className: 'app-container', style: { padding: '20px', fontFamily: 'sans-serif' } },
    React.createElement('h1', null, '🍞 TOAST 🍞'),
    React.createElement('p', null, 'Tous à sa table'),
    React.createElement('button',{ onClick: loadFile },'📁 Charger un fichier' ),
    error && React.createElement('p',null,error),
    filePath && React.createElement('p',null,'📄 ' + filePath)
  );
}

export default App;



