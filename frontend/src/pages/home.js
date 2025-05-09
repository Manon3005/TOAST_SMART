import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import { ResetButton } from "../components/resetButton";
import { ContinueButton } from "../components/continueButton";
import { TableColumn } from "../components/tableColumn";
import { ConflictCenter } from "../components/conflictCenter";
import React, { useState } from 'react';
import '../App.css';
import { GenerateButton } from "../components/generateButton";


export function Home() {
    
    const [tableData, setTableData] = useState(Array(8).fill(''));
    const headers = ['ticket','lastName', 'firstName', 'buyerLastName', 'buyerFirstName', 'buyerEmail', 'diet', 'wantedTableMates'];

    const [maxTables, setMaxTables] = useState(1);
    const [maxGuests, setMaxGuests] = useState(1);
    const [nameFile, setName] = useState('');
    const [errorFile, setErrorFile] = useState('');
    const [lockedContinue, setLockedContinue] = useState(false);
    const [lockedGenerer, setLockedGenerer] = useState(false);
    const [headersCSV, setHeadersCSV] = useState(['','','','','','','','']);
    

    const [filePath, setPath] = useState(''); 
    
    const loadFile = async () => {
        try {
            const jsonFile = await window.electronAPI.pickFile();
            if (!jsonFile.filePath.endsWith('.csv')) {
                setErrorFile('Veuillez sélectionner un fichier .csv');
                return;
            }
            setHeadersCSV(jsonFile.headersCSV);
            const name = jsonFile.filePath.split(/[/\\]/).pop();
            setName(name);
            setPath(jsonFile.filePath);
            setErrorFile('');
        } catch (err) {
            setErrorFile('Erreur chargement du fichier');
            setPath('');
    }
  };


    const actionContinue = () => {
        setLockedContinue(true);
        setLockedGenerer(false);
        generateCSVColumn();
    };

    const generateCSVColumn = () => {
        const jsonColumnNames = headers.reduce((acc, name, index) => {
            acc[name] = tableData[index];
            return acc;
        }, {});
    
        window.electronAPI.parseCsvFile(jsonColumnNames)
    }
    

    const actionGenerer = () => {
        setLockedGenerer(true);
    };

    const actionReset = () => {
        setMaxTables(1);
        setMaxGuests(1);
        setLockedContinue(false);
        setName('');
        setErrorFile('');
        setLockedGenerer(true);
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
            
            React.createElement(FileButton, {className: 'file-button', onClick : loadFile, disabled: lockedContinue, nameFile: nameFile, setName: setName, errorFile : errorFile, setErrorFile : setErrorFile}),
            
            React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData, disabled : lockedContinue, headersCSV : headersCSV}),
            React.createElement(ConflictCenter,{disabled : lockedGenerer}),
            
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
              React.createElement(InputNumber, {value: maxTables, onChange: val => setMaxTables(parseInt(val, 10)) },'Nombre max de tables')
            ),
            React.createElement('div', { className: 'nb-guest' },
              React.createElement('p', null, 'Nombre de convives maximum/table :'),
              React.createElement(InputNumber, {value: maxGuests, onChange: val => setMaxGuests(parseInt(val, 10)) }, 'Nombre max de convives par table' )
            ),
            React.createElement(GenerateButton, {className: 'file-button', onClick: actionGenerer, disabled: !lockedContinue,}),
            )
          )
        )
}
