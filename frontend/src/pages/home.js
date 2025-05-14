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
import { AddStudentManual } from "../components/addStudentManual";
import { AddStudentButton } from "../components/addStudentButton";


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
    const [groupTableFinalAddress, setGroupTableFinalAdress] = useState('');

    const [loadPicture, setLoadPicture] = useState(false);

    const [nameExportFile, setNameExportFile] = useState('');
    const [errorExportFile, setErrorExportFile] = useState('');


    const [isVisible, setIsVisible] = useState(false); 
    const [selectedChoice, setSelectedChoice] = useState('max_demand');
    const [nameFileDraftPlan, setNameFileDraftPlan] = useState('');
    const [statsJson, setStatsJson] = useState({});
    const [rapportJson, setRapportJson] = useState({});
    
    const [filePath, setPath] = useState('');

    const [selectedOption, setSelectedOption] = React.useState('--selectionnez--');

    const [listStudent, setListStudent] = React.useState([]);



    const [errorActionReset, setErrorActionReset] = useState('');

    // Modals states
    const [finTraitementModalOpen, setFinTraitementModalOpen] = useState(false);
    const openFinTraitementModal = () => setFinTraitementModalOpen(true);
    const closeFinTraitementModal = () => setFinTraitementModalOpen(false);

    const [errorExportFileModal, setErrorExportFileModal] = useState(false);
    const openErrorExportFileModal = () => setErrorExportFileModal(true);
    const closeErrorExportFileModal = () => setErrorExportFileModal(false);

    const [errorActionResetModal, setErrorActionResetModal] = useState(false);
    const openErrorActionResetModal = () => setErrorActionResetModal(true);
    const closeErrorActionResetModal = () => setErrorActionResetModal(false);

    const [rapportModal, setRapportModal] = useState(false);
    const openRapportModal = () => setRapportModal(true);
    const closeRapportModal = () => setRapportModal(false);

    const handleSelectionChange = (value) => {
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
            setErrorFile('');
        } catch (err) {
            setErrorFile('Erreur chargement du fichier');
            setName('');
            setHeadersCSV(['','','','','','','','']);
      }
    };


    const loadPlanFile = async () => {
        try {
            const jsonResult = await window.electronAPI.getStatistics();
            setStatsJson(jsonResult.statsJson);
            setRapportJson({});
            setFinalAdress(jsonResult.address.split(/[/\\]/).pop())
            setGroupTableFinalAdress(' / ')

            
        } catch (err) {
          alert("Problème configuration du fichier")
      }
    };
  


    const actionContinue = async () => {
        setLockedContinue(true);
        const result = await generateCSVColumn();
        if (result) {
          setPreprocessingStep(false);
          setConflictStep(true);
        }
    };

    const actionExporter = () => {
      exporterCSV();
    }

    const exporterCSV = async () => {
      try{
        const path = await window.electronAPI.exportTablesCsv();
        setNameExportFile(path.split(/[/\\]/).pop());
      } catch {
        openErrorExportFileModal();
      }
    }

    const generateCSVColumn = async () => {
        setLoadPicture(true);
        const jsonColumnNames = headers.reduce((acc, name, index) => {
            acc[name] = tableData[index];
            return acc;
        }, {});
        try {
          const jsonConflict = await window.electronAPI.parseCsvFile(jsonColumnNames);
          setLoadPicture(false);
          if (jsonConflict.error){
            actionReset(jsonConflict.error);
            return false;
          } else {
            if (!jsonConflict.conflictInformations.jsonContent || Object.keys(jsonConflict.conflictInformations.jsonContent).length === 0) {
              setConflictManagment(true);
              setConflictCase(null);
              return true;
            }
            setListStudent(jsonConflict.listStudents);
            setConflictCase({
              ...jsonConflict.conflictInformations.jsonContent,
              remainingConflictNumber: jsonConflict.conflictInformations.remainingConflictNumber
            });
            return true;
          }
        } catch {
          alert("Les noms de colonnes ne correspondent pas, ou ne sont pas complétés");
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
        setFinalAdress(jsonResult.addressPlanTable.split(/[/\\]/).pop());
        setGroupTableFinalAdress(jsonResult.addressGroupTable.split(/[/\\]/).pop())
        setStatsJson(jsonResult.statsJson);
        setRapportJson(jsonResult.rapportJson);
        if (jsonResult.rapportJson && Object.keys(jsonResult.rapportJson).length > 0 && (jsonResult.rapportJson.nb_table_missing > 0 || jsonResult.rapportJson.nb_student_without_table > 0 || jsonResult.rapportJson.extra_table > 0)){
          setRapportModal(true);
        }
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
          setErrorActionReset(error);
          openErrorActionResetModal();
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

      const jsonConflict = await window.electronAPI.getNextConflict(exportJson);
      setLoadPicture(false);
      if (!jsonConflict.jsonContent || Object.keys(jsonConflict.jsonContent).length === 0) {
            setConflictManagment(true);
            setConflictCase(null);
            return;
      }
      setConflictCase({
        ...jsonConflict.jsonContent,
        remainingConflictNumber: jsonConflict.remainingConflictNumber
      });
      
      if (conflictCase.remainingConflictNumber == 0){
        setConflictManagment(true);
      }
    };
    
    const acceptConflict = () => {
      nextConflict("valid");
    };
    
    const refuseConflict = () => {
      nextConflict("invalid");
    };

    const actionAddStudent = async () => {
      const jsonInput = {
          id_student : conflictCase.idStudent,
          id_neighbour : selectedOption ,
      }
      try {
        const jsonTemp = await window.electronAPI.addNeighbour(jsonInput)
        if (!jsonTemp.jsonContent || Object.keys(jsonTemp.jsonContent).length === 0) {
          setConflictManagment(true);
          setConflictCase(null);
          return;
        }

        setConflictCase({
          ...jsonTemp.jsonContent,
          remainingConflictNumber: jsonTemp.remainingConflictNumber
        });

      } catch{
        alert("Problème ajout étudiant");
      }
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
                disabled: !nameFile || tableData.some(value => value === ''),
              }),
              React.createElement(ResetButton, {
                onClick: () => actionReset(),
                disabled : false
              })
            ),
            errorActionResetModal && React.createElement('div', { className: 'modal-overlay', onClick: closeErrorActionResetModal },
              React.createElement('div', { className: 'modal-content' },
              React.createElement('p', null, errorActionReset),
              React.createElement('button', { className: 'modal-close-button', onClick: closeErrorActionResetModal }, 'Fermer')
              )
            ),
            loadPicture && React.createElement('div', { className: 'loading-container' },
              React.createElement('img', {
                  src: 'img/loading.gif',
                  alt: 'Chargement...',
                  className: 'spinner'
              }),
              React.createElement('p', null, 'Chargement en cours...')
            )
          ),

          conflictStep && React.createElement('div', { className: 'conflicts-step' },
            React.createElement('div', { className: 'left-part' },

              React.createElement('br', null),
              !conflictManagment && React.createElement('div', null,
                React.createElement(AddStudentManual,{label: 'Ajouter etudiant manuellement',
                                                        listStudent :listStudent,
                                                        value: selectedOption,
                                                        onChange: setSelectedOption,
                                                        disabled: false}
                ),
                React.createElement('br', null),
                React.createElement(AddStudentButton, {onClick : actionAddStudent}),
                          
              ),
              
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
              !conflictManagment && React.createElement('div', { className: 'right-part' },
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
                finalAddress && React.createElement('div', {className : 'file-line'},
                  React.createElement('span', {className: 'label'}, 'Solution :\u00A0'), 
                  React.createElement('span', {className: 'file-name'}, finalAddress),
                ),
                groupTableFinalAddress && React.createElement('div', {className : 'file-line'},
                  React.createElement('span', {className: 'label'}, 'Groupement des tables :\u00A0'),
                  React.createElement('span', {className: 'file-name'}, groupTableFinalAddress),
                ),
              )
            ),
            React.createElement('div', { className: 'right-part' },
              React.createElement(StatCenter, { nameFileDraftPlan: nameFileDraftPlan, finalAddress: finalAddress, statsJson: statsJson, rapportJson: rapportJson }),
              React.createElement(ExportSolutionButton, {onClick: actionExporter,errorExportFile : errorExportFile, 
              nameExportFile : nameExportFile, disabled: !nameFileDraftPlan && !finalAddress} ) 
            ),

            errorExportFileModal && React.createElement('div', { className: 'modal-overlay', onClick: closeErrorExportFileModal },
              React.createElement('div', { className: 'modal-content' },
              React.createElement('p', null, "Erreur lors de l'exportation du fichier CSV : Veuillez vérifier que le fichier n'est pas déjà ouvert."),
              React.createElement('button', { className: 'modal-close-button', onClick: closeErrorExportFileModal }, 'Fermer')
              )
            ),

            rapportModal && React.createElement('div', { className: 'modal-overlay', onClick: closeRapportModal },
              React.createElement('div', { className: 'modal-content'},
                React.createElement('h2', null, 'Erreur dans la génération !'),
                React.createElement('p', null, `Nombre de tables manquantes : ${rapportJson.nb_table_missing}`),
                React.createElement('p', null, `Nombre d'étudiants sans table : ${rapportJson.nb_student_without_table}`),
                React.createElement('p', null, `Nombre de tables en trop dans la solution : ${rapportJson.extra_table}`),
                React.createElement('button', { className: 'modal-close-button', onClick: closeRapportModal }, 'Fermer')
              )
            )
              
          )
        )
      );
}
