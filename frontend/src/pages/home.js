import { FileButton } from "../components/fileButton";
import { InputNumber } from "../components/inputNumber";
import { ResetButton } from "../components/resetButton";
import { ContinueButton } from "../components/continueButton";
import { TableColumn } from "../components/tableColumn";
import { ConflictCenter } from "../components/conflictCenter";
import { StudentGuestDisplay } from "../components/studentGuestDisplay";
import { ExportSolutionButton } from "../components/exportSolutionButton";
import { StatCenter } from "../components/statCenter";
import { InputPlanButton } from "../components/inputPlanButton";
import { ChoiceRadioButton } from "../components/choiceRadioButton";
import { GenerateButton } from "../components/generateButton";


import React, { useState, useEffect  } from 'react';
import '../App.css';

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
    const [preprocessingStep, setPreprocessingStep] = useState(true);
    const [conflictStep, setConflictStep] = useState(false);
    const [tablePlanStep, setTablePlanStep] = useState(false);

    const [conflictCase, setConflictCase] = useState({})
    const [returnConflict, setReturnConflict] = useState("");
    const [conflictManagment, setConflictManagment] = useState(false);

    const [finalAddress, setFinalAdress] = useState('');

    const [loadPicture, setLoadPicture] = useState(true);

    const [nameExportFile, setNameExportFile] = useState('');
    const [errorExportFile, setErrorExportFile] = useState('');


    const [isVisible, setIsVisible] = useState(false); 
    const [selectedChoice, setSelectedChoice] = useState('max_demand');
    const [nameFileDraftPlan, setNameFileDraftPlan] = useState('');
    const [statsJson, setStatsJson] = useState({});
    
    const [filePath, setPath] = useState('');

    const [finTraitementModalOpen, setFinTraitementModalOpen] = useState(false);
    
    const openFinTraitementModal = () => setFinTraitementModalOpen(true);
    const closeFinTraitementModal = () => setFinTraitementModalOpen(false);

    const handleSelectionChange = (value) => {
      console.log('Valeur sélectionnée :', value);
      setSelectedChoice(value);
    };
    
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


    const loadPlanFile = async () => {
        try {
            const jsonResult = await window.electronAPI.getStatistics();
            setStatsJson(jsonResult.statsJson);
            setFinalAdress(jsonResult.address.split(/[/\\]/).pop())

            
        } catch (err) {
          alert("Problème configuration du fichier")
      }
    };
  


    const actionContinue = () => {
        setLockedContinue(true);
        setPreprocessingStep(false);
        setConflictStep(true);
        generateCSVColumn();
    };

    const actionExporter = () => {
      exporterCSV();
    }

    const exporterCSV = async () => {
      try{
        const path = await window.electronAPI.exportTablesCsv();
        setNameExportFile(path.split(/[/\\]/).pop());
      } catch {
        alert("Problème fichier export")
      }
    }

    const generateCSVColumn = async () => {
        setLoadPicture(true);
        const jsonColumnNames = headers.reduce((acc, name, index) => {
            acc[name] = tableData[index];
            return acc;
        }, {});
    
        const jsonConflict = await window.electronAPI.parseCsvFile(jsonColumnNames);
        console.log(jsonConflict);
        setLoadPicture(false);
        if (jsonConflict.error){
          actionReset(jsonConflict.error);
        } else {
          if (!jsonConflict.jsonContent || Object.keys(jsonConflict.jsonContent).length === 0) {
            setConflictManagment(true);
            setConflictCase(null);
            return;
          }
          setConflictCase({
            ...jsonConflict.jsonContent,
            remainingConflictNumber: jsonConflict.remainingConflictNumber
          });
        }
    }
    
    const genererPlan = async () => {

      const exportJson = {
        max_number_tables: maxTables,
        max_number_by_tables: maxGuests,
        selected_choice: selectedChoice,
      };

      try {
        const jsonResult = await window.electronAPI.generateTablePlan(exportJson);
        setFinalAdress(jsonResult.address.split(/[/\\]/).pop());
        setStatsJson(jsonResult.statsJson);
      }
      catch (error) {
        console.error('Erreur lors de la génération du plan de table :', error);
        alert('Erreur lors de la génération du plan de table');
      }
      
    }

    const actionFinTraitement = () => {
      setConflictStep(false);
      setTablePlanStep(true);
      genererIntermediate();
    }

    const genererIntermediate = async () => {
      try {
        const addressIntermediate = await window.electronAPI.generateIntermediateCsv();
        openFinTraitementModal();
      } catch{
        console.error('Erreur lors de la fin du traitement');
        alert('Erreur lors de la fin du traitement');
      }
      

    }

    const actionGenerer = () => {
        setLockedGenerer(true);
        genererPlan();
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

    const nextConflict = async (result) => {
      setLoadPicture(true);
      const exportJson = {
        id_student: conflictCase.idStudent,
        id_neighbour: conflictCase.conflict.idNeighbour,
        result: result
      };

      const jsonTemp = await window.electronAPI.getNextConflict(exportJson);
      setLoadPicture(false);
      if (!jsonTemp.jsonContent || Object.keys(jsonTemp.jsonContent).length === 0) {
        setConflictManagment(true);
        setConflictCase(null);
        return;
      }

      setConflictCase({
        ...jsonTemp.jsonContent,
        remainingConflictNumber: jsonTemp.remainingConflictNumber
      });
      
      if (conflictCase.remainingConflictNumber == 0){
        setConflictManagment(true);
      }
      console.log(conflictCase);
    };
    
    const acceptConflict = () => {
      nextConflict("valid");
    };
    
    const refuseConflict = () => {
      nextConflict("invalid");
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

          preprocessingStep && React.createElement('div', { className: 'preprocessing-step' },
            React.createElement('h2', null, 'Prétraitement des données'), 
            React.createElement(FileButton, {className: 'classic-button', onClick : loadFile, disabled: lockedContinue, nameFile: nameFile, setName: setName, errorFile : errorFile, setErrorFile : setErrorFile}),
            React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData, disabled : lockedContinue, headersCSV : headersCSV}),
            finalAddress && React.createElement('p', null, finalAddress),
            
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

          conflictStep && React.createElement('div', { className: 'conflicts-step' },
            React.createElement('div', { className: 'left-part' },
              
              React.createElement(ConflictCenter,{
                fin : conflictManagment,
                disabled: lockedGenerer,
                student: conflictCase,
                onAccept: acceptConflict,
                onRefuse: refuseConflict,
                onFin : actionFinTraitement,
                load : loadPicture,
              }),
                          
            ),
            React.createElement('div', { className: 'right-part' },
              React.createElement(StudentGuestDisplay,{student : conflictCase}),
            )
          ),

          finTraitementModalOpen && React.createElement('div', { className: 'modal-overlay', onClick: closeFinTraitementModal },
            React.createElement('div', { className: 'modal-content' },
            React.createElement('p', null, 'Fichier intermédiaire généré avec succès à l\'emplacement du fichier initialement importé'),
            React.createElement('button', { className: 'modal-close-button', onClick: closeFinTraitementModal }, 'Fermer')
            )
          ),

          tablePlanStep && React.createElement('div', { className: 'table-plan-step' },
            React.createElement('div', { className: 'left-part' },
              React.createElement('h2', null, 'Configurer vos tables :'),
              React.createElement('div', {className: 'option-choices'},
                React.createElement('div', { className: 'nb-table' },
                  React.createElement('p', null, 'Nombre de tables maximum:'),
                  React.createElement(InputNumber, {value: maxTables, onChange: val => setMaxTables(parseInt(val, 10)) },'Nombre max de tables')
                ),
                React.createElement('div', { className: 'nb-guest' },
                  React.createElement('p', null, 'Nombre de convives maximum/table :'),
                  React.createElement(InputNumber, {value: maxGuests, onChange: val => setMaxGuests(parseInt(val, 10)) }, 'Nombre max de convives par table' )
                ), 
                React.createElement('div', { className: 'radio-button-container' },
                  React.createElement('h2', 'null', 'Sélectionner le critère de génération du plan de table :'),
                  React.createElement(ChoiceRadioButton, { onSelectionChange: handleSelectionChange }),
                ),
              ),
              React.createElement('div', { className: 'input-generate-container' },
                React.createElement('div', { className: 'buttons-row' },
                    React.createElement(GenerateButton, { onClick: actionGenerer }),
                    React.createElement(InputPlanButton, { onClick: loadPlanFile, nameFileDraftPlan: nameFileDraftPlan, setName: setName, errorFile: errorFile, setErrorFile: setErrorFile })
                ),
                finalAddress && React.createElement('p', null, finalAddress)
              )
            ),
            React.createElement('div', { className: 'right-part' },
              React.createElement(StatCenter, { nameFileDraftPlan: nameFileDraftPlan, finalAddress: finalAddress, statsJson: statsJson }),
              React.createElement(ExportSolutionButton, {onClick: actionExporter,errorExportFile : errorExportFile, 
              nameExportFile : nameExportFile, disabled: !nameFileDraftPlan && !finalAddress} ) 
            ),
              
          )
        )
      );
}
