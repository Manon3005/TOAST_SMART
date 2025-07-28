import { useState } from "react";
import { Input } from "../components/atoms/Input";
import { RadioOption } from "../types/RadioOption";
import { RadioButtonGroup } from "../components/molecules/RadioButtonGroup";
import { Button } from "../components/atoms/Button";
import { StatsCenter } from "../components/molecules/StatsCenter";
import { ExportSolutionGroup } from "../components/molecules/ExportSolutionGroup";
import { Rapport } from "../types/Rapport";
import { GenerateTablePlan } from "../types/GenerateTablePlan";
import { TablePlan } from "../types/TablePlan";
import { StatsJson } from "../types/StatsJson";
import { AppHeader } from "../components/molecules/AppHeader";

export default function Solution () {

    const [maxTables, setMaxTables] = useState(1);
    const [maxGuests, setMaxGuests] = useState(1);
    const [selectedChoice, setSelectedChoice] = useState('min_table');
    const [outputFilePath, setOutputFilePath] = useState<string | undefined>(undefined);
    const [tableGroupFilePath, setTableGroupFilePath] = useState<string | undefined>(undefined);
    const [exportFilePath, setExportFilePath] = useState<string | undefined>(undefined);
    const [stats, setStats] = useState<StatsJson | null>(null);
    const [rapport, setRapport] = useState<Rapport | null>(null);
    const [isRapportModalVisible, setIsRapportModalVisible] = useState<boolean>(false);


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
        const exportJson : GenerateTablePlan = {
            max_number_tables: maxTables,
            max_number_by_tables: maxGuests,
            selected_choice: selectedChoice,
        };
        
        const result : TablePlan = await window.electronAPI.generateTablePlan(exportJson);
        setOutputFilePath(result.addressPlanTable.split(/[/\\]/).pop());
        setTableGroupFilePath(result.addressGroupTable.split(/[/\\]/).pop());
        setStats(result.statsJson);
        setRapport(result.rapportJson);
        if (result.rapportJson.nb_table_missing > 0 || result.rapportJson.nb_student_without_table > 0 || result.rapportJson.extra_table > 0) {
            setIsRapportModalVisible(true);
        }
    }

    const handleOnClickImport = async () => {
        const result = await window.electronAPI.getStatistics();
        setOutputFilePath(result.address.split(/[/\\]/).pop())
        setTableGroupFilePath(' / ')
        setStats(result.statsJson);
        setRapport(null);
    }

    const handleOnClickExport = async () => {
        const path = await window.electronAPI.exportTablesCsv();
        setExportFilePath(path.split(/[/\\]/).pop());
    }

    const handleOnClickCloseModal = async () => {
        setIsRapportModalVisible(false);
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
        <div className='app-container'>
            <AppHeader />
            <div className='app-content'>
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
                                    value={maxGuests} 
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
                                <div className='buttons-row'>
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
                    {rapport && isRapportModalVisible && <div className='modal-overlay' onClick={handleOnClickCloseModal}>
                        <div className='modal-content'>
                            <h2>Erreur dans la génération !</h2>
                            <p>{`Nombre de tables manquantes : ${rapport.nb_table_missing}`}</p>
                            <p>{`Nombre d'étudiants sans table : ${rapport.nb_student_without_table}`}</p>
                            <p>{`Nombre de tables en trop dans la solution : ${rapport.extra_table}`}</p>
                            <Button className='modal-close-button' onClick={handleOnClickCloseModal} text='Fermer'></Button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}