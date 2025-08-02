import React from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <nav className="flex justify-between items-center bg-black px-[20px] py-[10px] rounded-b-[15px]">
      <div className="flex items-center">
        <Link
          to="/"
          className="min-w-[69px] max-w-[188px] inline-block text-center text-white text-[18px] font-normal hover:font-bold hover:scale-[1.05] transition-transform transition-[font-weight] duration-100 ease-in-out no-underline"
        >
          Accueil
        </Link>
      </div>
      <div className="flex items-center gap-[30px]">
        <Link
          to="/explanation"
          className="min-w-[69px] max-w-[188px] inline-block text-center text-white text-[18px] font-normal hover:font-bold hover:scale-[1.05] transition-transform transition-[font-weight] duration-100 ease-in-out no-underline"
        >
          Comment ça marche ?
        </Link>
        <Link
          to="/support"
          className="min-w-[69px] max-w-[188px] inline-block text-center text-white text-[18px] font-normal hover:font-bold hover:scale-[1.05] transition-transform transition-[font-weight] duration-100 ease-in-out no-underline"
        >
          Support
        </Link>
      </div>
    </nav>
  );
};
