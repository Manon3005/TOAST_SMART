import React from 'react';
import ReactDOM, { Container } from 'react-dom/client';
import './styles/index.css';
import AppRouter from './AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root') as Container);
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);