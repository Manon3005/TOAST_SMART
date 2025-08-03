import { useState } from "react";
import { Input } from "../components/atoms/Input";
import { RadioOption } from "../types/RadioOption";
import { RadioButtonGroup } from "../components/molecules/RadioButtonGroup";
import { Button } from "../components/atoms/Button";
import { SolutionStatsCenter } from "../components/organisms/SolutionStatsCenter";
import { SolutionExportGroup } from "../components/molecules/SolutionExportGroup";
import { Rapport } from "../types/Rapport";
import { GenerateTablePlan } from "../types/GenerateTablePlan";
import { TablePlan } from "../types/TablePlan";
import { StatsJson } from "../types/StatsJson";
import { AppHeader } from "../components/organisms/AppHeader";
import { SolutionConfiguration } from "../components/organisms/SolutionConfiguration";
import { SolutionCriteria } from "../components/organisms/SolutionCriteria";
import { SolutionGeneration } from "../components/organisms/SolutionGeneration";
import { SolutionErrorModal } from "../components/organisms/SolutionErrorModal";

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

  return (
    <div className="h-full flex flex-col items-center bg-[#E9E9E9] font-['Segoe_UI'] text-white px-[20px] gap-[20px]">
      <AppHeader />
      <div className="w-full flex flex-1 flex-col items-center justify-start">
        <div className="w-full max-w-[1200px] flex flex-row justify-between items-stretch gap-[4%]">
          <div className="flex flex-col justify-start items-center w-[45%] bg-white p-[20px] rounded-[20px] custom-shadow gap-[20px]">
            <SolutionConfiguration
              maxTables={maxTables}
              maxGuests={maxGuests}
              handleMaxTablesInputChange={handleMaxTablesInputChange}
              handleMaxGuestsInputChange={handleMaxGuestsInputChange}
            />
            <SolutionCriteria handleSelectionChange={handleSelectionChange} />
            <SolutionGeneration
              handleOnClickGenerate={handleOnClickGenerate}
              outputFilePath={outputFilePath}
              tableGroupFilePath={tableGroupFilePath}
            />
          </div>
          <div className="flex flex-col justify-between items-center w-[45%] bg-white p-[20px] rounded-[20px] custom-shadow gap-[20px]">
            <SolutionStatsCenter data={stats} />
            <SolutionExportGroup
              onClick={handleOnClickExport}
              fileName={exportFilePath}
              disabled={false} //à corriger
              isError={false} //à corriger
            />
          </div>
          {rapport && isRapportModalVisible && (
            <SolutionErrorModal
              handleOnClickCloseModal={handleOnClickCloseModal}
              rapport={rapport}
            />
          )}
        </div>
      </div>
    </div>
  );
}
