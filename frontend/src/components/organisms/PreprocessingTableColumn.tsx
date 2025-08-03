import { Option } from "../atoms/Option";
import { Select } from "../atoms/Select";

export const PreprocessingTableColumn = ({
  tableData,
  setTableData,
  disabled,
  headersCSV,
}: {
  tableData: string[];
  setTableData: (tableData: string[]) => void;
  disabled: boolean;
  headersCSV: string[];
}) => {
  const headers = [
    "Numéro billet",
    "Nom",
    "Prénom",
    "Nom acheteur",
    "Prénom Acheteur",
    "Mail acheteur",
    "Regime alimentaire",
    "Voisins souhaités",
  ];

  return (
    <div className="grid grid-cols-2 gap-y-[10px]">
      {headers.map((label, i) => (
        <div className="flex flex-col items-center w-full gap-[5px]" key={i}>
          <label className="text-black">{label}</label>
          <Select
            value={tableData[i]}
            disabled={disabled}
            onChange={(e) => {
              const newData = [...tableData];
              newData[i] = e.target.value;
              setTableData(newData);
            }}
          >
            <Option key={"default"} value="default">
              -- Sélectionnez --
            </Option>
            {headersCSV.map((opt, j) => {
              const isSelectedElsewhere =
                tableData.includes(opt) && tableData[i] !== opt;
              return (
                opt && (
                  <Option key={opt} value={opt} disabled={isSelectedElsewhere}>
                    {opt}
                  </Option>
                )
              );
            })}
          </Select>
        </div>
      ))}
    </div>
  );
};
