import React from "react";
import { Link } from "react-router-dom";

export function NavBar() {
    return React.createElement(
        'nav',
        { className: 'navbar' },
        React.createElement(
            'div',
            { className: 'navbar-left' },
            React.createElement(
                Link,
                { to: '/', className: 'nav-link' },
                'Accueil'
            )
        ),
        React.createElement(
            'div',
            { className: 'navbar-right' },
            React.createElement(
                Link,
                { to: '/explanation', className: 'nav-link' },
                'Comment ça marche ?'
            ),
            React.createElement(
                Link,
                { to: '/support', className: 'nav-link' },
                'Support'
            )
        )
    );
}