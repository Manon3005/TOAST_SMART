import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import { FinTraitementButton } from "./finTraitementButton";
import React from 'react';
import '../App.css';

export function ConflictCenter({ student, onAccept, onRefuse, disabled, fin, onFin, load }) {
    if (load) {
        return React.createElement('div', { className: 'loading-container' },
            React.createElement('img', {
                src: 'img/loading.gif',
                alt: 'Chargement...',
                className: 'spinner'
            }),
            React.createElement('p', null, 'Chargement en cours...')
        );
    }

    if (fin) {
        return React.createElement('div', null,
            React.createElement('h3', null, 'Traitement terminé'),
            React.createElement(FinTraitementButton, { onClick: onFin, disabled: disabled })
        );
    }

    const remaining = student?.remainingConflictNumber ?? 0;
    const diplomaName = `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim();
    const preferences = student?.neighboursEntry ?? '';
    const conflictFirst = student?.conflict?.firstName ?? '';
    const conflictLast = student?.conflict?.lastName ?? '';
    const conflictGuests = student?.conflict?.guests ?? [];
    const guestNames = conflictGuests.map(guest => `${guest.guestFirstName ?? ''} ${guest.guestLastName ?? ''}`.trim()).join(', ');
    const guestDisplay = conflictGuests.length > 0 ? ` (${guestNames})` : '';
    return React.createElement('div', null,
        React.createElement('p', null,
            React.createElement('strong', null, 'Nombre de conflits restants : '),
            remaining
        ),
        React.createElement('p', null,
            React.createElement('strong', null, '🎓 Diplômé.e : '),
            diplomaName
        ),
        React.createElement('p', null,
            React.createElement('strong', null, 'Préférences indiquées : '),
            preferences
        ),
        React.createElement('p', null,
            React.createElement('strong', null, '👤 Voisin.e proposé.e : '),
            `${conflictFirst} ${conflictLast}${guestDisplay}`
        ),
        React.createElement('div', { className: 'conflict-container-buttons' },
            React.createElement('button', { className: 'classic-button', onClick: onAccept }, 'Accepter'),
            React.createElement('button', { className: 'classic-button', onClick: onRefuse }, 'Refuser')
        )
    );
}
