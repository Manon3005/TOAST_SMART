import React from "react";
import { Link } from "react-router-dom";

export function NavBar() {
    return React.createElement(
        'nav',
        { className: 'navbar' },
        React.createElement(
            Link,
            { to: '/', className: 'nav-link' },
            'TOAST 🍞'
        ),
        React.createElement(
            Link,
            { to: '/explanation', className: 'nav-link' },
            'Explanation'
        )
    );
}
