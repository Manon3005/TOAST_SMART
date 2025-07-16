import '../../styles/App.css';
import StudentConflictItem from '../molecules/StudentConflictItem';

const StudentConflictList = ({ items, onItemClick }) => {
  return (
    <div className="item-list-container">
      {items.map((item, index) => (
        <StudentConflictItem
          key={item.id}
          name={item.firstName}
          surname={item.lastName}
          conflictCount={item.conflictCount}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default StudentConflictList;
