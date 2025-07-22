import '../../styles/App.css';
import { Student } from '../../types/Student';
import { Button } from '../atoms/Button';

export const StudentCard = ({
  student,
  onClickAccept,
  onClickRefuse
} : {
  student: Student,
  onClickAccept: () => void,
  onClickRefuse: () => void
}) => {
  if (!student || Object.keys(student).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  let guestNames;
  let guestDisplay;

  if (student.conflict.length > 0) {
    guestNames = student.conflict[0].guests.map(guest => `${guest.guestFirstName ?? ''} ${guest.guestLastName ?? ''}`.trim()).join(', ');
    guestDisplay = student.conflict[0].guests.length > 0 ? ` (${guestNames})` : '';
  }

  return (
    <div className="student-container">
      <h2 className="student-title">{student.firstName} {student.lastName}</h2>

      <h3 className="section-title">Invités</h3>
      {Array.isArray(student.guests) && student.guests.length > 0 ? (
        <ul className="list">
          {student.guests.map((g, i) => (
            <li key={i} className="list-item">
              {g.guestFirstName} {g.guestLastName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-msg">Aucun invité 😂🫵.</p>
      )}

      <h3 className="section-title">Voisins</h3>
      {Array.isArray(student.processedNeighbours) && student.processedNeighbours.length > 0 ? (
        <ul className="list">
          {student.processedNeighbours.map((n, i) => (
            <li key={i} className="list-item">
              {n.neighbourFirstName} {n.neighbourLastName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-msg">Aucun voisin.</p>
      )}

      {student.conflict.length > 0 && (
        <div>
          <h3 className="section-title">Conflits</h3>
          <p><strong>{student.conflict.length}</strong> conflit(s) restant(s)</p>
          <p><strong>🗨️ Préférences indiquées : </strong>{student.neighboursEntry}</p>
          <p><strong>👤 Voisin.e proposé.e : </strong>{student.conflict[0].firstName} {student.conflict[0].lastName} {guestDisplay}</p>
          <div className='conflict-container-buttons'>
            <Button className='classic-button' onClick={onClickAccept} text='✅ Accepter'></Button>
            <Button className='classic-button' onClick={onClickRefuse} text='❌ Refuser'></Button>
          </div>
        </div>
      )}
    </div>
  );
}