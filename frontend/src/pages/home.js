import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import { ResetButton } from "../components/resetButton";
import { ContinueButton } from "../components/continueButton";
import { TableColumn } from "../components/tableColumn";
import React, { useState } from 'react';
import '../App.css';


export function Home() {
    
    const [tableData, setTableData] = useState(Array(7).fill(''));

    const [maxTables, setMaxTables] = useState(1);
    const [maxGuests, setMaxGuests] = useState(1);
    const [nameFile, setName] = useState('');
    const [errorFile, setErrorFile] = useState('');
    const [locked, setLocked] = useState(false);

    const actionContinue = () => {setLocked(true)}
    const actionReset = () => {
        setMaxTables(1);
        setMaxGuests(1);
        setLocked(false);
        setName('');
        setErrorFile('');
    };

    return React.createElement(
        'div',
        { className: 'app-container'},
        React.createElement('div', { className: 'app-header' },
          React.createElement('h1', null, '🍞 TOus A Sa Table 🍞'),
          React.createElement('h3', null, 'Réalisez votre plan de table en quelques clics !')
        ),
        React.createElement('div', { className: 'app-content' },
          React.createElement('div', { className: 'left-part' },
            React.createElement('h2', null, 'Prétraitement des données'), 
            
            //React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData}), //disabled : disabled

            React.createElement(FileButton, {className: 'file-button', disabled: locked, nameFile: nameFile, setName: setName, errorFile : errorFile, setErrorFile : setErrorFile}),
            React.createElement('div', {className: 'continue-reset-buttons'},
                React.createElement(ContinueButton, {
                  onClick: actionContinue
                }),
                React.createElement(ResetButton, {
                  onClick: actionReset
                })
              ),
            
          ),
          React.createElement('div', { className: 'right-part' },
            React.createElement('div', { className: 'nb-table' },
              React.createElement('p', null, 'Nombre de tables maximum:'),
              React.createElement(InputNumber, {value: maxTables, disabled: locked, onChange: val => setMaxTables(parseInt(val, 10)) },'Nombre max de tables')
            ),
            React.createElement('div', { className: 'nb-guest' },
              React.createElement('p', null, 'Nombre de convives maximum/table :'),
              React.createElement(InputNumber, {value: maxGuests, disabled: locked, onChange: val => setMaxGuests(parseInt(val, 10)) }, 'Nombre max de convives par table' )
            ),
            )
          )
        )
}
