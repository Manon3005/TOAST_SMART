import React from 'react';
import '../App.css';

export function TableColumn({ tableData, setTableData, disabled, headersCSV }) {
  const headers = [
    'Numéro billet', 'Nom', 'Prénom', 'Nom acheteur',
    'Prénom Acheteur', 'Mail acheteur', 'Regime alimentaire', 'Voisins souhaités'
  ];

  return React.createElement(
    'div',
    { className: 'two-column-select' },
    ...headers.map((label, i) =>
      React.createElement(
        'div',
        { className: 'select-row', key: i },
        React.createElement('label', null, label),
        React.createElement(
          'select',
          {
            value: tableData[i],
            disabled: disabled,
            onChange: (e) => {
              const newData = [...tableData];
              newData[i] = e.target.value;
              setTableData(newData);
            }
          },
          React.createElement('option', { value: '' }, '-- Sélectionnez --'),
          ...headersCSV.map((opt, j) => {
            // Vérifie si cette option est déjà sélectionnée ailleurs
            const isSelectedElsewhere = tableData.includes(opt) && tableData[i] !== opt;
            return opt && React.createElement(
              'option',
              {
                key: j,
                value: opt,
                disabled: isSelectedElsewhere
              },
              opt
            );
          })
        )
      )
    )
  );
}
