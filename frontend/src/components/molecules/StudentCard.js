import '../../styles/App.css';

export const StudentCard = ({student}) => {
  if (!student || Object.keys(student).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  return (
    <div className="student-container">
      <h2 className="student-title">Résumé de l'étudiant</h2>

      <p className="info-line">
        <strong>Nom: </strong>
        {student.lastName}
      </p>

      <p className="info-line">
        <strong>Prénom: </strong>
        {student.firstName}
      </p>

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
    </div>
  );
}