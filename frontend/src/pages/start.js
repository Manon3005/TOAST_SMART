import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StartButton } from "../components/startButton";

export function Start() {
  const navigate = useNavigate();

  return React.createElement(
    'div',
    { className: 'start-container' },
    React.createElement('div', { className: 'start-header' },
        React.createElement(
            'h1',
            { className: 'page-title' },
            React.createElement('img', { src: 'img/Logo TOAST.png', alt: 'Logo', className: 'logo-inline' }),
            ' TOus A Sa Table ',
            React.createElement('img', { src: 'img/Logo TOAST.png', alt: 'Logo', className: 'logo-inline' })
        ),  
        React.createElement('h3', null, 'Réalisez votre plan de table en quelques clics !'),
    ),
    
    React.createElement(StartButton, { onClick: () => navigate('/home'), disabled: false })
  );
}
