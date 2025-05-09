import React, { useState } from 'react';
import '../App.css';



export function TableColumn({ tableData, setTableData, disabled, headersCSV }) {
    const headers = ['Nom', 'Prénom', 'Nom acheteur', 'Prénom Acheteur', 'Mail acheteur', 'Regime alimentaire', 'Voisins souhaités'];
  
    // const options = [
    //   '', // Valeur vide par défaut
    //   'Option 1',
    //   'Option 2',
    //   'Option 3',
    //   'Option 4'
    // ];

    const options = headersCSV;
  
    return React.createElement(
      'table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          ...headers.map((column, i) => React.createElement('th', { key: i }, column))
        )
      ),
      React.createElement('tbody', null,
        React.createElement('tr', null,
          ...tableData.map((val, i) =>
            React.createElement('td', { key: i },
              React.createElement('select', {
                value: val,
                disabled: disabled,
                onChange: (e) => {
                  const newData = [...tableData];
                  newData[i] = e.target.value;
                  setTableData(newData);
                }
              },
                options.map((opt, j) =>
                  React.createElement('option', { key: j, value: opt }, opt)
                )
              )
            )
          )
        )
      )
    );
  }
  
