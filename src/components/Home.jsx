import React from "react";
import { Link } from "react-router-dom";
import "animate.css/animate.min.css"; 

const Home = () => {
  return (
    <div className="relative text-center py-32 min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-40"
        style={{
          backgroundImage: `url(/Home-img.jpg)`,
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          borderRadius: 20,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <h1 className="text-8xl font-extrabold text-white mb-6 animate__animated animate__fadeInDown">
          Welcome to ExpTrak
        </h1>
        <p className="text-white text-xl max-w-2xl mb-12 animate__animated animate__fadeIn animate__delay-1s">
          Take control of your finances. Track your expenses and manage your budget effortlessly with our easy-to-use platform.
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 animate__animated animate__fadeIn animate__delay-2s"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
