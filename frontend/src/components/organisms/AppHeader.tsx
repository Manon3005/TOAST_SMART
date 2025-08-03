export const AppHeader = ({}) => {
  return (
    <div className="w-full flex flex-col items-center mt-[20px] gap-[10px]">
      <div className="w-full flex flex-row justify-center items-center text-[40px] mt-0 text-black font-bold">
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
      <h3 className="text-[1.2rem] text-black font-bold">
        Réalisez votre plan de table en quelques clics !
      </h3>
    </div>
  );
};
