import React from 'react';
import '../../styles/App.css'

export function StartButton({ onClick, disabled }) {
  return React.createElement(
    'button',
    {
      className: 'start-button',
      onClick: onClick,
      disabled: disabled
    },
    'Commencer'
  );
}
