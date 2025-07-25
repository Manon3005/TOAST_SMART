import { Button } from "../components/atoms/Button";
import { TableColumn } from "../components/organisms/TableColumn";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnsCSV } from "../types/ColumnsCSV";
import { AppHeader } from "../components/molecules/AppHeader";

export default function Preprocessing () {

    const navigate = useNavigate();

    const [nameFile, setNameFile] = useState('');
    const [headersCSV, setHeadersCSV] = useState(Array(8).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const [tableData, setTableData] = useState(Array(8).fill(''));

    const headers = ['ticket','lastName', 'firstName', 'buyerLastName', 'buyerFirstName', 'buyerEmail', 'diet', 'wantedTableMates'];

    const loadFile = async () => {
        try {
            setErrorMessage('');
            const jsonFile = await window.electronAPI.pickFile();
            if (!jsonFile.filePath.endsWith('.csv')) {
                setErrorMessage('Veuillez sélectionner un fichier .csv')
                return;
            }
            setHeadersCSV(jsonFile.headersCSV);
            const name = jsonFile.filePath.split(/[/\\]/).pop();
            setNameFile(name!);
        } catch (err) {
            setErrorMessage('Erreur chargement du fichier');
            setNameFile('');
            setHeadersCSV(Array(8).fill(''));
      }
    };

    const generateCSVColumn = async () => {
        // setLoadPicture(true);
        const columns = headers.reduce((acc, header, index) => {
            acc[header as keyof ColumnsCSV] = tableData[index];
            return acc;
        }, {} as ColumnsCSV);

        try {
          const jsonConflict = await window.electronAPI.parseCsvFile(columns);
          // setLoadPicture(false);
          if (jsonConflict.error){
            actionReset();
            console.log(jsonConflict.error); // à afficher plus tard
            return false;
          } else {
            return true;
          }
        } catch {
          alert("Les noms de colonnes ne correspondent pas, ou ne sont pas complétés");
        }
    }

    const handleFileProcessing = async () => {
        const result = await generateCSVColumn();
        if (result) {
            navigate('/conflicts')
        } else {
            console.log("erreur dans generateCSVColumn");
        }
    };

    const actionReset = () => {   
        setNameFile('');
        setErrorMessage('');
        setHeadersCSV(['','','','','','','','']);
        setTableData(Array(8).fill(''));
    }

    return (
        <div className='app-container'>
            <AppHeader />
            <div className="app-content">
                <div className="preprocessing-step">
                    <h2>Prétraitement des données</h2>
                    <div className="file-button-container">
                        <Button onClick={loadFile} text='📁 Charger un fichier'/>
                        {(errorMessage != "" &&
                            <p style={{color: 'red'}}>{errorMessage}</p>
                        )}
                        {(nameFile != "" &&
                            <p style={{color: 'green'}}>{nameFile}</p>
                        )}
                    </div>
                    <TableColumn
                        tableData={tableData}
                        setTableData={setTableData}
                        disabled={false}
                        headersCSV={headersCSV}
                    />
                    <div className="continue-reset-buttons">
                        <Button 
                            disabled={nameFile == '' || tableData.some(value => value === '')}
                            text="Traiter le CSV"
                            className="continue-button"
                            onClick={handleFileProcessing}
                        />
                        <Button 
                            onClick={actionReset} 
                            text="Annuler"
                            className='reset-button'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}