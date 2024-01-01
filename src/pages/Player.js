import React, { useEffect, useState } from "react";

const Player = () => {
  const [playerName, setPlayerName] = useState("");
  const [savedPlayer, setSavedPlayer] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("lottery");

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
        lotteries.push({
          id: lotteryId,
          createdAt: Date.now(),
          numbers: selectedNumbers,
          generated: false,
          wasDrawn: false,
        });
        localStorage.setItem("lotteries", JSON.stringify(lotteries));
        localStorage.setItem(
          "operator_balance",
          parseInt(localStorage.getItem("operator_balance")) + 500
        );
      } else {
        alert("Nincs elég egyenleged!");
      }
    } else {
      alert("Kérlek válassz ki 5 darab számot!");
    }
  };

  const generateLotteryId = () => {
    return Math.random().toString(36).substring(2, 32);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-900 w-screen h-screen">
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleTabChange("lottery")}
              className={`${
                activeTab === "lottery" ? "bg-blue-500" : "bg-gray-800"
              } hover:bg-blue-700 text-white py-2 px-3 rounded-3xl`}
            >
              Lottery
            </button>
            <button
              onClick={() => handleTabChange("history")}
              className={`${
                activeTab === "history" ? "bg-blue-500" : "bg-gray-800"
              } hover:bg-blue-700 text-white py-2 px-3 rounded-3xl`}
            >
              Szelvények
            </button>
          </div>
          {activeTab === "lottery" && (
            <>
              {savedPlayer ? (
                <>
                  <h1 className="text-3xl text-white font-bold">
                    Rakj meg egy szelvényt!
                  </h1>
                  <p className="text-white">Egyenleged: {balance} akcse</p>
                  <div className="w-1/4">
                    {Array.from({ length: 39 }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => handleNumberSelection(number)}
                          className={`${
                            selectedNumbers.includes(number)
                              ? "bg-blue-500"
                              : "bg-gray-800"
                          } hover:bg-blue-700 text-white py-2 px-3 rounded-3xl mr-2 mb-2`}
                        >
                          {number}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={handlePlay}
                    className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl mt-4"
                  >
                    Szelvény megtétele
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl text-white font-bold">
                    Add meg a neved!
                  </h1>
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
                </>
              )}
            </>
          )}
          {activeTab === "history" && (
            <div className="text-white">
              <h1 className="text-3xl text-white font-bold">
                Megtett szelvényeim
              </h1>
              <div className="flex flex-col space-y-2">
                {JSON.parse(localStorage.getItem("lotteries") || "[]").map(
                  (lottery) => (
                    <div key={lottery.id}>
                      <p className="text-xl">{lottery.numbers.join(", ")}</p>
                      <span>
                        {new Date(lottery.createdAt).toLocaleString()}
                      </span>
                      {lottery.wasDrawn ? (
                        <span className="text-green-500">
                          Kihúzott számok: {lottery.drawnNumbers.join(", ")}
                        </span>
                      ) : (
                        <span className="text-red-500">
                          Nem volt még sorosolás
                        </span>
                      )}
                      <hr />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
