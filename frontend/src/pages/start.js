import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StartButton } from "../components/startButton";

export function Start() {
  const navigate = useNavigate();

  return (
  <div className="start-container">
    <div className="start-header">
      <h1 className="page-title">
        <img src="img/Logo TOAST.png" alt="Logo" className="logo-inline" />
        TOus A Sa Table
        <img src="img/Logo TOAST.png" alt="Logo" className="logo-inline" />
      </h1>
      <h3>Réalisez votre plan de table en quelques clics !</h3>
    </div>

    <StartButton onClick={() => navigate('/home')} disabled={false} />
  </div>
);
}
