import { useState } from "react";
import { Input } from "../components/atoms/Input";
import { RadioOption } from "../types/RadioOption";
import { RadioButtonGroup } from "../components/molecules/RadioButtonGroup";
import { Button } from "../components/atoms/Button";
import { StatsCenter } from "../components/molecules/StatsCenter";
import { ExportSolutionGroup } from "../components/molecules/ExportSolutionGroup";
import { Rapport } from "../types/Rapport";

export default function Solution () {

    const [maxTables, setMaxTables] = useState(1);
    const [maxGuests, setMaxGuests] = useState(1);
    const [selectedChoice, setSelectedChoice] = useState('min_table');
    const [outputFilePath, setOutputFilePath] = useState(null);
    const [tableGroupFilePath, setTableGroupFilePath] = useState(null);
    const [exportFilePath, setExportFilePath] = useState('');
    const [stats, setStats] = useState(null);
    const [rapport, setRapport] = useState<Rapport | null>(null);


    const handleMaxTablesInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setMaxTables(parseInt(event.target.value));
    }

    const handleMaxGuestsInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setMaxGuests(parseInt(event.target.value));
    }

    const handleSelectionChange = (value : string) => {
      setSelectedChoice(value);
    };

    const handleOnClickGenerate = async () => {

    }

    const handleOnClickImport = async () => {

    }

    const handleOnClickExport = async () => {

    }

    const handleOnClickCloseModal = async () => {

    }

    const radioOptions : RadioOption[] = [
        {
            value:'min_table',
            label: 'Minimiser le nombre de tables'
        },
        {
            value:'max_demand',
            label: 'Favoriser le nombre de demandes satisfaites'
        },
        {
            value:'max_student',
            label: 'Favoriser le nombre d\'étudiants satisfaits'
        },
        {
            value:'less_guest',
            label: 'Satisfaire en priorité les étudiants avec le moins d\'invités'
        }
    ]

    return (
        <div className= 'table-plan-step'>
            <div className='left-part'>
                <h2>Configurer vos tables :</h2>
                <div className='option-choices'>
                    <div className='nb-table'>
                        <p>Nombre de tables maximum :</p>
                        <Input 
                            type='number'
                            value={maxTables} 
                            onChange={handleMaxTablesInputChange} 
                            min='1' 
                            disabled={false}
                        ></Input>
                    </div>
                    <div className='nb-table'>
                        <p>Nombre de convives maximum/table :</p>
                        <Input 
                            type='number'
                            value={maxTables} 
                            onChange={handleMaxGuestsInputChange} 
                            min='1' 
                            disabled={false}
                        ></Input>
                    </div>
                    <div className='radio-button-container' >
                        <h2>Sélectionner le critère de génération du plan de table :</h2>
                        <RadioButtonGroup
                            radioOptions={radioOptions}
                            defaultValue="min_table"
                            onSelectionChange={handleSelectionChange}
                        ></RadioButtonGroup>
                    </div>
                    <div className='input-generate-container'>
                        <div>
                            <Button className='classic-button' onClick={handleOnClickGenerate} text='Générer la solution'></Button>
                            <Button className='classic-button' onClick={handleOnClickImport} text='📁 Importer une solution'></Button>
                        </div>
                    </div>
                    {outputFilePath && <div className='file-line'>
                        <span className='label'>{'Solution :\u00A0'}</span>
                        <span className='file-name'>{outputFilePath}</span>
                    </div>}
                    {tableGroupFilePath && <div className='file-line'>
                        <span className='label'>{'Groupement des tables :\u00A0'}</span>
                        <span className='file-name'>{tableGroupFilePath}</span>
                    </div>}
                </div>
            </div>
            <div className='right-part'>
                <StatsCenter data={stats}></StatsCenter>
                <ExportSolutionGroup 
                    onClick={handleOnClickExport} 
                    fileName={exportFilePath}
                    disabled={false} //à corriger
                    isError={false} //à corriger
                ></ExportSolutionGroup>
            </div>
            <div className='modal-overlay' onClick={handleOnClickCloseModal}>
                <div className='modal-content'>
                        <h2>Erreur dans la génération !</h2>
                        {rapport && <div>
                            <p>{`Nombre de tables manquantes : ${rapport.nb_table_missing}`}</p>
                            <p>{`Nombre d'étudiants sans table : ${rapport.nb_student_without_table}`}</p>
                            <p>{`Nombre de tables en trop dans la solution : ${rapport.extra_table}`}</p>
                            <Button className='modal-close-button' onClick={handleOnClickCloseModal} text='Fermer'></Button>
                        </div>}
                </div>
            </div>
        </div>
    );
}