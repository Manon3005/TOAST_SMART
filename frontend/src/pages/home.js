import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import { ResetButton } from "../components/resetButton";
import { ContinueButton } from "../components/continueButton";
import { TableColumn } from "../components/tableColumn";
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
        { className: 'app-container', style: { padding: '20px', fontFamily: 'sans-serif' } },
        React.createElement('h1', null, '🍞 TOAST 🍞'),
        React.createElement('p', null, 'Tous à sa table'),
        React.createElement(FileButton, {className: 'file-button', disabled: locked, nameFile: nameFile, setName: setName, errorFile : errorFile, setErrorFile : setErrorFile}),
        React.createElement(InputNumber, {value: maxGuests, disabled: locked, onChange: val => setMaxGuests(parseInt(val, 10)) }, 'Nombre max de convives par table' ),
        React.createElement(InputNumber, {value: maxTables, disabled: locked, onChange: val => setMaxTables(parseInt(val, 10)) },'Nombre max de tables'),

        React.createElement('div', { style: { marginTop: '20px' } },
            React.createElement(ContinueButton, {
              onClick: actionContinue,
              style: { marginRight: '10px' }
            }),
            React.createElement(ResetButton, {
              onClick: actionReset
            })
          ),
        React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData}) //disabled : disabled
        );
}
