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
          <select
            className="w-[70%] border border-[#ccc] rounded-[10px] p-[5px] text-black truncate"
            value={tableData[i]}
            disabled={disabled}
            onChange={(e) => {
              const newData = [...tableData];
              newData[i] = e.target.value;
              setTableData(newData);
            }}
          >
            <option className="text-black" key={"default"} value="default">
              -- Sélectionnez --
            </option>
            {headersCSV.map((opt, j) => {
              const isSelectedElsewhere =
                tableData.includes(opt) && tableData[i] !== opt;
              return (
                opt && (
                  <option
                    className="text-black"
                    key={opt}
                    value={opt}
                    disabled={isSelectedElsewhere}
                  >
                    {opt}
                  </option>
                )
              );
            })}
          </select>
        </div>
      ))}
    </div>
  );
};
