import { useNavigate } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { AppHeader } from "../components/organisms/AppHeader";

export function Start() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center gap-[100px]">
      <AppHeader />
      <Button
        className="px-[100px] py-[50px] bg-white text-[50px] font-bold text-black outline outline-2 outline-black rounded-[50px] cursor-pointer hover:bg-black hover:text-white hover:outline-white hover:-translate-y-[10px] transition-colors transition-transform duration-300 transform"
        onClick={() => navigate("/preprocessing")}
        disabled={false}
        text="Commencer"
      />
    </div>
  );
}
