import React, { useState } from 'react';

export function Support() {

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);

    const closeModal = () => setModalOpen(false);

    return React.createElement(
        'div',
        { className: 'support-page' },
            React.createElement('div', { className: 'support-container' },
            React.createElement('h1', { className: 'support-title' }, 'Support'),
            React.createElement('p', { className: 'support-content' }, 'Ce projet a été réalisé dans le cadre du projet SMART par un groupe d\'étudiants de 4ème année du département Informatique de l\'INSA Lyon.'),
            React.createElement('p', { className: 'support-content' }, 'Pour toute question ou problème, n\'hésitez pas à nous contacter à l\'adresse suivante : manon.bertrand@insa-lyon.fr'),
            React.createElement('p', { className: 'support-content' }, 'Vous pouvez également consulter notre dépôt GitHub pour plus d\'informations sur le projet : https://github.com/Manon3005/TOAST'),
        ),
        React.createElement('img', { className: 'support-image', src: 'img/Logo TOAST.png', useMap: '#toastmap' }),
            React.createElement('map', { name: 'toastmap' },
                React.createElement('area', {
                    shape: 'rect',
                    coords: '150,110,180,130', // X1, Y1, X2, Y2 en pixels par rapport à l'image
                    onClick: openModal,
                })
            ),
        
        isModalOpen && React.createElement('div', { className: 'modal-overlay', onClick: closeModal },
                React.createElement('div', { className: 'modal-content' },
                    React.createElement('h2', null, 'Félicitations !'),
                    React.createElement('p', null, 'Notre algorithme de placement est maintenant 235% plus performant !'),
                    React.createElement('button', { className: 'modal-close-button', onClick: closeModal }, 'Fermer')
                )
            )
    );
}