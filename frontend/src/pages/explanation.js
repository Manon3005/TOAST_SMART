import React, { useState } from 'react';



export function Explanation() {


    return React.createElement(
    'div',
    { className: 'explanation-container'},
        React.createElement('div', { className: 'explanation-header' },
                  React.createElement('h1', null, 'Comment TOAST fonctionne ?'),
        ),
        React.createElement('div', { className: 'explanation-content' },
            React.createElement('div', { className: 'explanation-step' },
                React.createElement('div', {className: 'image-container'},
                    React.createElement('img', {src: 'img/explanation.png', className: 'step-image1'})
                ),
                React.createElement('div', { className: 'step-text' },
                    React.createElement('p', null, 'Description de la première étape. Description de la première étape. Description de la première étape. Description de la première étape. Description de la première étape. Description de la première étape. Description de la première étape. Description de la première étape.')
                )
            ),
            React.createElement('div', { className: 'explanation-step' },
                React.createElement('div', { className: 'step-text' },
                    React.createElement('p', null, 'Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape. Description de la deuxième étape.')
                ),
                React.createElement('div', {className: 'image-container'},
                    React.createElement('img', {src: 'img/explanation.png', className: 'step-image2'})
                ),
            ),
            React.createElement('div', { className: 'explanation-step' },
                React.createElement('div', {className: 'image-container'},
                    React.createElement('img', {src: 'img/explanation.png', className: 'step-image1'})
                ),
                React.createElement('div', { className: 'step-text' },
                    React.createElement('p', null, 'Description de la troisième étape. Description de la troisième étape. Description de la troisième étape. Description de la troisième étape. Description de la troisième étape. Description de la troisième étape. Description de la troisième étape. Description de la troisième étape.')
                )
            ),
        )
    );
}