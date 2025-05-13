import React from 'react';
import '../App.css';

export function ExportSolutionButton({ onClick, disabled }) {
  return React.createElement(
    'button',
    {
      className: 'export-solution-button',
      onClick: onClick,
      disabled: disabled
    },
    'Exporter la solution'
  );
}