import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-900 w-screen h-screen">
      <div>
        <div className="flex justify-center h-screen items-center">
          <div className="flex flex-col space-y-3 text-center">
            <h1 className="text-3xl text-white font-bold">Válassz módot</h1>
            <Link
              to="/player"
              className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl"
            >
              Játékos
            </Link>
            <Link
              to="/operator"
              className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl"
            >
              Üzemeltető
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
