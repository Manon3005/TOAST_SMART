import React from "react";
import { Link } from "react-router-dom";
import '../../styles/App.css';

export const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
            <Link to="/" className="nav-link">
                Accueil
            </Link>
            </div>
            <div className="navbar-right">
            <Link to="/explanation" className="nav-link">
                Comment ça marche ?
            </Link>
            <Link to="/support" className="nav-link">
                Support
            </Link>
            </div>
        </nav>
    );
}