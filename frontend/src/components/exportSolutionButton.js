import React from 'react';
import '../App.css';

export function ExportSolutionButton({ onClick, disabled, nameExportFile, errorExportFile }) {
  return React.createElement(
      'div',
      null,
      React.createElement('div', { className: 'file-button-container' },
        React.createElement(
            'button',
            { onClick: onClick, className: 'export-solution-button', disabled : disabled},'Exporter la solution' ),
        
        React.createElement('div', { className: 'file-message-text' },
          errorExportFile && React.createElement('p', { style: { color: 'red' } }, errorExportFile),
          nameExportFile && React.createElement('p', null, '📄 ' + nameExportFile)
        )
      ),
  );
}