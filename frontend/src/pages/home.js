import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import { ResetButton } from "../components/resetButton";
import { ContinueButton } from "../components/continueButton";
import { TableColumn } from "../components/tableColumn";
import { ConflictCenter } from "../components/conflictCenter";
import React, { useState, useEffect  } from 'react';
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

    const [tableConflicts, setTableConflicts] = useState([])
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [currentNeighbourIndex, setCurrentNeighbourIndex] = useState(0);
    const [refusedNeighbours, setRefusedNeighbours] = useState([]);

    const [isVisible, setIsVisible] = useState(false); 

    React.useEffect(() => {
      if (tableConflicts.length > 0) {
        setCurrentStudentIndex(0);
        setCurrentNeighbourIndex(0);
        console.log(tableConflicts[currentStudentIndex])
      }
    }, [tableConflicts]);
    

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

    const generateCSVColumn = async () => {
        const jsonColumnNames = headers.reduce((acc, name, index) => {
            acc[name] = tableData[index];
            return acc;
        }, {});
    
        const jsonConflicts = await window.electronAPI.parseCsvFile(jsonColumnNames);
        console.log(jsonConflicts);
        if (jsonConflicts.error){
          actionReset(jsonConflicts.error);
        }
        else {
          setTableConflicts(jsonConflicts.graduated_students);
        } 
    }
    

    const actionGenerer = () => {
        setLockedGenerer(true);
    };

    const actionReset = (error='') => {
        if (!error){
          setMaxTables(1);
          setMaxGuests(1);      
          setName('');
          setErrorFile('');
          setHeadersCSV(['','','','','','','','']);
          setTableData(Array(8).fill(''));
        }
        else if (error){
          alert(error);
        }
        setLockedGenerer(true);
        setLockedContinue(false);
    };

    const nextConflict = () => {
      const student = tableConflicts[currentStudentIndex];
    
      if (currentNeighbourIndex + 1 < student.processedNeighbours.length) {
        setCurrentNeighbourIndex(prev => prev + 1);
      } else if (currentStudentIndex + 1 < tableConflicts.length) {
        setCurrentStudentIndex(prev => prev + 1);
        setCurrentNeighbourIndex(0);
      } else {
        console.log("Terminé");
        console.log(refusedNeighbours);
      }
    };
    
    const acceptConflict = () => {
      nextConflict();
    };
    
    const refuseConflict = () => {
      const student = tableConflicts[currentStudentIndex];
      const neighbour = student.processedNeighbours[currentNeighbourIndex];
    
      setRefusedNeighbours(prev => {
        const existing = prev.find(r => r.idStudent === student.idStudent);
        if (existing) {
          return prev.map(r => r.idStudent === student.idStudent
            ? { ...r, refusedNeighbours: [...r.refusedNeighbours, neighbour.neighbourId] }
            : r
          );
        } else {
          return [...prev, {
            idStudent: student.idStudent,
            refusedNeighbours: [neighbour.neighbourId]
          }];
        }
      });
    
      nextConflict();
    };

    return React.createElement(
        'div',
        { className: 'app-container'},
        React.createElement('div', { className: 'app-header' },
          React.createElement(
              'h1',
              { className: 'page-title' },
              React.createElement('img', { src: 'img/Logo TOAST.png', alt: 'Logo', className: 'logo-inline' }),
              ' TOus A Sa Table ',
              React.createElement('img', { src: 'img/Logo TOAST.png', alt: 'Logo', className: 'logo-inline' })
          ),  
          React.createElement('h3', null, 'Réalisez votre plan de table en quelques clics !'),
        ),
        React.createElement('div', { className: 'app-content' },
          React.createElement('div', { className: 'preprocessing step' },
            React.createElement('h2', null, 'Prétraitement des données'), 
            React.createElement(FileButton, {className: 'file-button', onClick : loadFile, disabled: lockedContinue, nameFile: nameFile, setName: setName, errorFile : errorFile, setErrorFile : setErrorFile}),
            React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData, disabled : lockedContinue, headersCSV : headersCSV}),

            React.createElement('div', {className: 'continue-reset-buttons'},
              React.createElement(ContinueButton, {
                onClick: actionContinue,
                disabled : lockedContinue
              }),
              React.createElement(ResetButton, {
                onClick: () => actionReset(),
                disabled : false
              })
            ),
          ),
          isVisible && React.createElement('div', { className: 'conflicts step' },
            React.createElement('div', { className: 'left-part' },
              
              React.createElement(ConflictCenter,{
                disabled: lockedGenerer,
                students: tableConflicts,
                currentStudentIndex: currentStudentIndex,
                currentNeighbourIndex: currentNeighbourIndex,
                onAccept: acceptConflict,
                onRefuse: refuseConflict
              }),
                          
            ),
            React.createElement('div', { className: 'right-part' },
              
              )
          ),
          isVisible && React.createElement('div', { className: 'table-plan step' },
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
        );
}
