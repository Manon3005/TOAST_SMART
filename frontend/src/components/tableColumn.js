import React, { useState } from 'react';
import '../App.css';



export function TableColumn({ tableData, setTableData, disabled }) {
    const headers = ['Nom', 'Prénom', 'Nom acheteur', 'Prénom Acheteur', 'Mail acheteur', 'Regime alimentaire', 'Voisins souhaités'];
  
    return React.createElement(
      'table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          ...headers.map((column, i) =>  React.createElement('th', { key: i }, column))  //le ... permet la decomposition individuelle d'un tableau
        )
      ),
      React.createElement('tbody', null,
        React.createElement('tr', null,
          ...tableData.map((val, i) =>
            React.createElement('td', { key: i },
              React.createElement('input', {
                type: 'text',
                value: val,
                disabled: disabled,
                onChange: (e) => {
                  const newData = [...tableData];
                  newData[i] = e.target.value;
                  setTableData(newData);
                }
              })
            )
          )
        )
      )
    );
  }
  
