import '../../styles/App.css';

const StudentConflictItem = ({ 
  name, 
  surname, 
  conflictCount, 
  onClick 
} : {
  name: string,
  surname: string,
  conflictCount: number,
  onClick: () => void
}) => {
  return (
    <div className="item" onClick={onClick}>
      <div className="item-name">
        {name} {surname}
      </div>
      <div className="item-conflicts" style={{color: conflictCount > 0 ? "#d33" : "#06ad2a"}}>
        {conflictCount} conflit{conflictCount > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default StudentConflictItem;
