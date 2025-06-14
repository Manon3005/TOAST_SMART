import React from 'react';
import '../App.css';

export function ExportSolutionButton({ onClick, disabled, nameExportFile, errorExportFile }) {
  return React.createElement(
      'div',
      null,
      React.createElement('div', { className: 'export-button-container' },
        React.createElement(
            'button',
            { onClick: onClick, className: 'classic-button', disabled : disabled},'Exporter le plan de table' ),
        
        React.createElement('div', { className: 'file-message-text' },
          errorExportFile && React.createElement('p', { style: { color: 'red' } }, errorExportFile),
          nameExportFile && React.createElement('p', null, '📄 ' + nameExportFile)
        )
      ),
  );
}