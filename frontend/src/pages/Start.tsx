import { useNavigate } from "react-router-dom";
import { Button } from "../components/atoms/Button";

export function Start() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center gap-[100px]">
      <div className="w-full flex flex-col items-center mt-[20px] gap-[10px]">
        <div className="w-full flex flex-row justify-center items-center text-[40px] mt-0 text-black">
          <img
            src="img/Logo TOAST.png"
            alt="Logo"
            className="w-[50px] h-[50px]"
          />
          TOus A Sa Table
          <img
            src="img/Logo TOAST.png"
            alt="Logo"
            className="w-[50px] h-[50px]"
          />
        </div>
        <h3 className="text-[1.2rem] text-black">
          Réalisez votre plan de table en quelques clics !
        </h3>
      </div>

      <Button
        className="px-[100px] py-[50px] bg-white text-[50px] font-bold text-black font-['Segoe_UI'] outline outline-2 outline-black rounded-[50px] cursor-pointer hover:bg-black hover:text-white hover:outline-white hover:-translate-y-[10px] transition-colors transition-transform duration-300 transform"
        onClick={() => navigate("/preprocessing")}
        disabled={false}
        text="Commencer"
      />
    </div>
  );
}
