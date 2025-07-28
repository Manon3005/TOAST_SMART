import '../../styles/App.css';

export const TableColumn = ({ 
  tableData, 
  setTableData, 
  disabled, 
  headersCSV 
} : {
  tableData: string[],
  setTableData: (tableData: string[]) => void,
  disabled: boolean,
  headersCSV: string[]
}) => {
  const headers = [
    'Numéro billet', 'Nom', 'Prénom', 'Nom acheteur',
    'Prénom Acheteur', 'Mail acheteur', 'Regime alimentaire', 'Voisins souhaités'
  ];

  return (
    <div className="two-column-select">
      {headers.map((label, i) => (
        <div className="select-row" key={i}>
          <label>{label}</label>
          <select
            value={tableData[i]}
            disabled={disabled}
            onChange={(e) => {
              const newData = [...tableData];
              newData[i] = e.target.value;
              setTableData(newData);
            }}
          >
            <option value="">-- Sélectionnez --</option>
            {headersCSV.map((opt, j) => {
              const isSelectedElsewhere = tableData.includes(opt) && tableData[i] !== opt;
              return opt && (
                <option key={j} value={opt} disabled={isSelectedElsewhere}>
                  {opt}
                </option>
              );
            })}
          </select>
        </div>
      ))}
    </div>
  );
}
