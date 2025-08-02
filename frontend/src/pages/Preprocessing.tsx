import { Button } from "../components/atoms/Button";
import { TableColumn } from "../components/organisms/TableColumn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnsCSV } from "../types/ColumnsCSV";
import { AppHeader } from "../components/molecules/AppHeader";

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
    <div className="flex flex-col items-center bg-[#E9E9E9] font-['Segoe_UI'] text-white p-[20px] pt-0 gap-[10px]">
      <AppHeader />
      <div className="w-full flex flex-1 flex-col items-center justify-start">
        <div className="h-full w-[90%] flex flex-col bg-white p-[20px] rounded-[20px] gap-[20px] custom-shadow">
          <h2 className="w-full text-black text-[18px] text-center font-bold">
            Prétraitement des données
          </h2>
          <div className="flex justify-center items-center gap-[20px]">
            <Button onClick={loadFile} text="📁 Charger un fichier" />
            {errorMessage != "" && (
              <p style={{ color: "red" }}>{errorMessage}</p>
            )}
            {nameFile != "" && <p style={{ color: "green" }}>{nameFile}</p>}
          </div>
          <TableColumn
            tableData={tableData}
            setTableData={setTableData}
            disabled={false}
            headersCSV={headersCSV}
          />
          <div className="flex flex-row justify-center gap-[50px]">
            <Button
              disabled={
                nameFile == "" || tableData.some((value) => value === "")
              }
              text="Traiter le CSV"
              className="py-[12px] px-[24px] bg-[#00c21a] hover:bg-[#00ff00] outline-2 outline-black text-black text-[1rem] rounded-[8px] cursor-pointer whitespace-nowrap	transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]"
              onClick={handleFileProcessing}
            />
            <Button
              onClick={actionReset}
              text="Annuler"
              className="py-[12px] px-[24px] bg-[#fa5c5c] hover:bg-[#ff0000] outline-2 outline-black text-black text-[1rem] rounded-[8px] cursor-pointer whitespace-nowrap	transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
