import React, { useState } from 'react';

export function Support() {

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);

    const closeModal = () => setModalOpen(false);

    return (
        <div className="support-page">
            <div className="support-container">
            <h1 className="support-title">Support</h1>
            <p className="support-content">
                Ce projet a été réalisé dans le cadre du projet SMART par un groupe d'étudiants de 4ème année du département Informatique de l'INSA Lyon.
            </p>
            <p className="support-content">
                Contributeurs : Manon Bertrand, Royce Cho, Aodren Pitard-Bouet, Adrien Doan, Mathis Getenet, Armand Brunet et Aubin Roche
            </p>
            <p className="support-content">
                Pour toute question ou problème, n'hésitez pas à nous contacter à l'adresse suivante : manon.bertrand@insa-lyon.fr
            </p>
            <p className="support-content">
                Vous pouvez également consulter notre dépôt GitHub pour plus d'informations sur le projet : https://github.com/Manon3005/TOAST
            </p>
            </div>

            <img className="support-image" src="img/Logo TOAST.png" useMap="#toastmap" />
            <map name="toastmap">
            <area
                shape="rect"
                coords="150,110,180,130"
                onClick={openModal}
            />
            </map>

            {isModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content">
                <h2>Félicitations !</h2>
                <p>Notre algorithme de placement est maintenant 235% plus performant !</p>
                <button className="modal-close-button" onClick={closeModal}>Fermer</button>
                </div>
            </div>
            )}
        </div>
    );
}