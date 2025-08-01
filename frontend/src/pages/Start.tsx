import { useNavigate } from "react-router-dom";
import { Button } from "../components/atoms/Button";

export function Start() {
  const navigate = useNavigate();

  return (
    <div className="start-container bg-red-300">
      <div className="start-header">
        <h1 className="page-title">
          <img src="img/Logo TOAST.png" alt="Logo" className="logo-inline" />
          TOus A Sa Table
          <img src="img/Logo TOAST.png" alt="Logo" className="logo-inline" />
        </h1>
        <h3>Réalisez votre plan de table en quelques clics !</h3>
      </div>

      <Button
        className="start-button"
        onClick={() => navigate("/preprocessing")}
        disabled={false}
        text="Commencer"
      />
    </div>
  );
}
