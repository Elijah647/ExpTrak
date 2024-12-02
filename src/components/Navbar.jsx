import React from "react";
import { Link } from "react-router-dom"; 
const Navbar = () => {
  return (
    <nav className="bg-black p-4 sticky top-0 shadow-lg shadow-white z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-white font-bold text-2xl cursor-pointer">
            ExpTrak
          </h1>
        </Link>
        <div className="text-white flex gap-8 font-bold text-md">
          <Link
            to="/dashboard"
            className="hover:text-blue-500 transition duration-200"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
