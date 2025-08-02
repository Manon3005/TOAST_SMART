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

export default function Solution() {
  const [maxTables, setMaxTables] = useState(1);
  const [maxGuests, setMaxGuests] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState("min_table");
  const [outputFilePath, setOutputFilePath] = useState<string | undefined>(
    undefined
  );
  const [tableGroupFilePath, setTableGroupFilePath] = useState<
    string | undefined
  >(undefined);
  const [exportFilePath, setExportFilePath] = useState<string | undefined>(
    undefined
  );
  const [stats, setStats] = useState<StatsJson | null>(null);
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [isRapportModalVisible, setIsRapportModalVisible] =
    useState<boolean>(false);

  const handleMaxTablesInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxTables(parseInt(event.target.value));
  };

  const handleMaxGuestsInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxGuests(parseInt(event.target.value));
  };

  const handleSelectionChange = (value: string) => {
    setSelectedChoice(value);
  };

  const handleOnClickGenerate = async () => {
    const exportJson: GenerateTablePlan = {
      max_number_tables: maxTables,
      max_number_by_tables: maxGuests,
      selected_choice: selectedChoice,
    };

    const result: TablePlan = await window.electronAPI.generateTablePlan(
      exportJson
    );
    setOutputFilePath(result.addressPlanTable.split(/[/\\]/).pop());
    setTableGroupFilePath(result.addressGroupTable.split(/[/\\]/).pop());
    setStats(result.statsJson);
    setRapport(result.rapportJson);
    if (
      result.rapportJson.nb_table_missing > 0 ||
      result.rapportJson.nb_student_without_table > 0 ||
      result.rapportJson.extra_table > 0
    ) {
      setIsRapportModalVisible(true);
    }
  };

  const handleOnClickImport = async () => {
    const result = await window.electronAPI.getStatistics();
    setOutputFilePath(result.address.split(/[/\\]/).pop());
    setTableGroupFilePath(" / ");
    setStats(result.statsJson);
    setRapport(null);
  };

  const handleOnClickExport = async () => {
    const path = await window.electronAPI.exportTablesCsv();
    setExportFilePath(path.split(/[/\\]/).pop());
  };

  const handleOnClickCloseModal = async () => {
    setIsRapportModalVisible(false);
  };

  const radioOptions: RadioOption[] = [
    {
      value: "min_table",
      label: "Minimiser le nombre de tables",
    },
    {
      value: "max_demand",
      label: "Favoriser le nombre de demandes satisfaites",
    },
    {
      value: "max_student",
      label: "Favoriser le nombre d'étudiants satisfaits",
    },
    {
      value: "less_guest",
      label: "Satisfaire en priorité les étudiants avec le moins d'invités",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center bg-[#E9E9E9] font-['Segoe_UI'] text-white px-[20px] gap-[20px]">
      <AppHeader />
      <div className="w-full flex flex-1 flex-col items-center justify-start">
        <div className="w-full max-w-[1200px] flex flex-row justify-between items-stretch gap-[4%]">
          <div className="flex flex-col justify-start items-center w-[45%] bg-white p-[20px] rounded-[20px] custom-shadow gap-[20px]">
            <div className="w-full flex flex-col justify-start items-center gap-[10px]">
              <h2 className="w-full text-center text-black text-[18px] font-bold">
                Configuration de tables :
              </h2>
              <div className="w-full flex flex-row items-center justify-between gap-[20px]">
                <p className="w-fit text-left">Nombre de tables maximum :</p>
                <Input
                  type="number"
                  value={maxTables}
                  onChange={handleMaxTablesInputChange}
                  min="1"
                  disabled={false}
                ></Input>
              </div>
              <div className="w-full flex flex-row items-center justify-between gap-[20px]">
                <p className="w-fit text-left">
                  Nombre de convives maximum/table :
                </p>
                <Input
                  type="number"
                  value={maxGuests}
                  onChange={handleMaxGuestsInputChange}
                  min="1"
                  disabled={false}
                ></Input>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-start gap-[10px]">
              <h2 className="text-center font-bold text-[18px] text-black">
                Critère de génération du plan de table :
              </h2>
              <RadioButtonGroup
                radioOptions={radioOptions}
                defaultValue="min_table"
                onSelectionChange={handleSelectionChange}
              ></RadioButtonGroup>
            </div>
            <div className="w-full flex flex-col justify-start gap-[5px]">
              <div className="w-full flex flex-row justify-between gap-[25px]">
                <Button
                  onClick={handleOnClickGenerate}
                  text="Générer la solution"
                ></Button>
                <Button
                  onClick={handleOnClickImport}
                  text="📁 Importer une solution"
                ></Button>
              </div>
              {outputFilePath && (
                <div className="w-full flex flex-row items-center justify-start">
                  <span className="font-bold text-black text-[13px]">
                    {"Solution :\u00A0"}
                  </span>
                  <span className="text-black text-[13px]">
                    {outputFilePath}
                  </span>
                </div>
              )}
              {tableGroupFilePath && (
                <div className="w-full flex flex-row items-center justify-start">
                  <span className="font-bold text-black text-[13px]">
                    {"Groupement des tables :\u00A0"}
                  </span>
                  <span className="text-black text-[13px]">
                    {tableGroupFilePath}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between items-center w-[45%] bg-white p-[20px] rounded-[20px] custom-shadow gap-[20px]">
            <StatsCenter data={stats}></StatsCenter>
            <ExportSolutionGroup
              onClick={handleOnClickExport}
              fileName={exportFilePath}
              disabled={false} //à corriger
              isError={false} //à corriger
            ></ExportSolutionGroup>
          </div>
          {rapport && isRapportModalVisible && (
            <div
              className="absolute inset-0 flex w-full h-full justify-center items-center bg-black/50 z-1"
              onClick={handleOnClickCloseModal}
            >
              <div className="max-w-[400px] w-[80%] flex flex-col items-center p-[30px] bg-white rounded-[15px] custom-shadow gap-[10px]">
                <h2 className="text-black font-bold text-[24px]">
                  Erreur dans la génération !
                </h2>
                <p className="text-black text-center font-[16px]">{`Nombre de tables manquantes : ${rapport.nb_table_missing}`}</p>
                <p className="text-black text-center font-[16px]">{`Nombre d'étudiants sans table : ${rapport.nb_student_without_table}`}</p>
                <p className="text-black text-center font-[16px]">{`Nombre de tables en trop dans la solution : ${rapport.extra_table}`}</p>
                <Button
                  className="bg-[#4caf50] hover:bg-[#45a049] rounded-[5px] px-[20px] py-[10px] text-white text-[16px] cursor-pointer"
                  onClick={handleOnClickCloseModal}
                  text="Fermer"
                ></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
