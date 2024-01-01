import React, { useEffect, useState } from "react";

const Player = () => {
  const [playerName, setPlayerName] = useState("");
  const [savedPlayer, setSavedPlayer] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("player_name");
    const storedBalance = localStorage.getItem("balance");
    if (storedPlayerName) {
      setSavedPlayer(storedPlayerName);
      setBalance(storedBalance);
    }
  }, []);

  const savePlayer = () => {
    localStorage.setItem("player_name", playerName);
    localStorage.setItem("balance", 10000);
    setSavedPlayer(playerName);
    setBalance(10000);
  };

  const handleNumberSelection = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      if (selectedNumbers.length < 5) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        alert("Csak 5 számot választhatsz ki!");
      }
    }
  };

  const handlePlay = () => {
    if (selectedNumbers.length === 5) {
      if (balance >= 500) {
        const lotteryId = generateLotteryId();
        localStorage.setItem("balance", balance - 500);
        setBalance(balance - 500);
        const lotteries = JSON.parse(localStorage.getItem("lotteries") || "[]");
        lotteries.push({ id: lotteryId, numbers: selectedNumbers });
        localStorage.setItem("lotteries", JSON.stringify(lotteries));
      } else {
        alert("Nincs elég egyenleged!");
      }
    } else {
      alert("Kérlek válassz ki 5 darab számot!");
    }
  };

  const generateLotteryId = () => {
    return Date.now().toString();
  };

  return (
    <div className="bg-gray-900 w-screen h-screen">
      {savedPlayer ? (
        <div className="flex justify-center h-screen items-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl text-white font-bold">
              Üdvözöllek, {savedPlayer}!
            </h1>
            <p className="text-white">Egyenleged: {balance} akcse</p>
            <div className="w-1/4">
              {Array.from({ length: 39 }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberSelection(number)}
                  className={`${
                    selectedNumbers.includes(number)
                      ? "bg-blue-500"
                      : "bg-gray-800"
                  } hover:bg-blue-700 text-white py-2 px-4 rounded-3xl mr-2 mb-2`}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              onClick={handlePlay}
              className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl mt-4"
            >
              Play
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center h-screen items-center">
          <div className="flex flex-col space-y-3 text-center">
            <h1 className="text-3xl text-white font-bold">Add meg a neved!</h1>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 text-white text-xl font-bold py-4 px-6 rounded-xl"
            />
            <button
              onClick={() => {
                savePlayer();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl"
            >
              Belépés
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
