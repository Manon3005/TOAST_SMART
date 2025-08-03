import { Button } from "../components/atoms/Button";
import { PreprocessingTableColumn } from "../components/organisms/PreprocessingTableColumn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnsCSV } from "../types/ColumnsCSV";
import { AppHeader } from "../components/organisms/AppHeader";
import { SubTitle } from "../components/atoms/SubTitle";
import { PreprocessingLoaderGroup } from "../components/molecules/PreprocessingLoaderGroup";
import { PreprocessingButtonsGroup } from "../components/molecules/PreprocessingButtonsGroup";

export default function Preprocessing() {
  const navigate = useNavigate();

  const [nameFile, setNameFile] = useState("");
  const [headersCSV, setHeadersCSV] = useState(Array(8).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [tableData, setTableData] = useState(Array(8).fill(""));

  const headers = [
    "ticket",
    "lastName",
    "firstName",
    "buyerLastName",
    "buyerFirstName",
    "buyerEmail",
    "diet",
    "wantedTableMates",
  ];

  const loadFile = async () => {
    try {
      setErrorMessage("");
      const jsonFile = await window.electronAPI.pickFile();
      if (!jsonFile.filePath.endsWith(".csv")) {
        setErrorMessage("Veuillez sélectionner un fichier .csv");
        return;
      }
      setHeadersCSV(jsonFile.headersCSV);
      const name = jsonFile.filePath.split(/[/\\]/).pop();
      setNameFile(name!);
    } catch (err) {
      setErrorMessage("Erreur chargement du fichier");
      setNameFile("");
      setHeadersCSV(Array(8).fill(""));
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
      if (jsonConflict.error) {
        actionReset();
        console.log(jsonConflict.error); // à afficher plus tard
        return false;
      } else {
        return true;
      }
    } catch {
      alert(
        "Les noms de colonnes ne correspondent pas, ou ne sont pas complétés"
      );
    }
  };

  const handleFileProcessing = async () => {
    const result = await generateCSVColumn();
    if (result) {
      navigate("/conflicts");
    } else {
      console.log("erreur dans generateCSVColumn");
    }
  };

  const actionReset = () => {
    setNameFile("");
    setErrorMessage("");
    setHeadersCSV(["", "", "", "", "", "", "", ""]);
    setTableData(Array(8).fill(""));
  };

  return (
    <div className="flex flex-col items-center bg-[#E9E9E9] font-['Segoe_UI'] text-white p-[20px] pt-0 gap-[20px]">
      <AppHeader />
      <div className="w-full flex flex-1 flex-col items-center justify-start">
        <div className="h-full w-[90%] flex flex-col bg-white p-[20px] rounded-[20px] gap-[20px] custom-shadow">
          <SubTitle>Prétraitement des données</SubTitle>
          <PreprocessingLoaderGroup
            loadFile={loadFile}
            errorMessage={errorMessage}
            nameFile={nameFile}
          />
          <PreprocessingTableColumn
            tableData={tableData}
            setTableData={setTableData}
            disabled={false}
            headersCSV={headersCSV}
          />
          <PreprocessingButtonsGroup
            nameFile={nameFile}
            tableData={tableData}
            handleFileProcessing={handleFileProcessing}
            actionReset={actionReset}
          />
        </div>
      </div>
    </div>
  );
}
