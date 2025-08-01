import { ChangeEvent, useState } from "react";
import { Student } from "../../types/Student";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { StudentConflictCount } from "../../types/StudentConflictCount";
import { StudentSelectList } from "./StudentSelectList";

export const StudentCard = ({
  student,
  students,
  onClickAccept,
  onClickRefuse,
  onNeighbourManuallyAdded,
  onNeighbourRemoved,
}: {
  student: Student;
  students: StudentConflictCount[];
  onClickAccept: () => void;
  onClickRefuse: () => void;
  onNeighbourManuallyAdded: (id_neighbour: number) => void;
  onNeighbourRemoved: (id_neighbour: number) => void;
}) => {
  const [neighbourValueSelected, setNeighbourValueSelected] =
    useState<number>(-1);

  if (!student || Object.keys(student).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  let guestNames;
  let guestDisplay;

  if (student.conflict.length > 0) {
    guestNames = student.conflict[0].guests
      .map((guest) =>
        `${guest.guestFirstName ?? ""} ${guest.guestLastName ?? ""}`.trim()
      )
      .join(", ");
    guestDisplay =
      student.conflict[0].guests.length > 0 ? ` (${guestNames})` : "";
  }

  return (
    <div className="student-container">
      <h2 className="student-title">
        {student.firstName} {student.lastName}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 className="section-title">Voisins</h3>
        {Array.isArray(student.processedNeighbours) &&
        student.processedNeighbours.length > 0 ? (
          <ul className="list">
            {student.processedNeighbours.map((n, i) => (
              <li key={i} className="list-item">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  {n.neighbourFirstName + " " + n.neighbourLastName}
                  <Button
                    className="remove-neighbour-button"
                    text={"-"}
                    onClick={() => onNeighbourRemoved(n.neighbourId)}
                  ></Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-msg">Aucun voisin.</p>
        )}
        <p>
          <strong>🗨️ Préférences indiquées : </strong>
          {student.neighboursEntry ? student.neighboursEntry : "/"}
        </p>
      </div>

      {student.conflict.length > 0 && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <h3 className="section-title">Conflits</h3>
          <p>
            <strong>{student.conflict.length}</strong> conflit(s) restant(s)
          </p>
          <p>
            <strong>👤 Voisin.e proposé.e : </strong>
            {student.conflict[0].firstName} {student.conflict[0].lastName}{" "}
            {guestDisplay}
          </p>
          <div className="conflict-container-buttons">
            <Button
              className="classic-button"
              onClick={onClickAccept}
              text="✅ Accepter"
            ></Button>
            <Button
              className="classic-button"
              onClick={onClickRefuse}
              text="❌ Refuser"
            ></Button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 className="section-title">Ajout Manuel</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StudentSelectList
            listStudent={students}
            value={neighbourValueSelected}
            onChange={setNeighbourValueSelected}
            disabled={false}
          />
          <Button
            text={"✚ Ajouter voisin"}
            onClick={() => onNeighbourManuallyAdded(neighbourValueSelected)}
            disabled={neighbourValueSelected === -1}
          ></Button>
        </div>
      </div>
    </div>
  );
};
