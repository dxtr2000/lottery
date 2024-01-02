import React, { useEffect, useState } from "react";

const Player = () => {
  const [playerName, setPlayerName] = useState("");
  const [savedPlayer, setSavedPlayer] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("lottery");
  const [lotteries, setLotteries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lotteriesPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalEarnings, setTotalEarnings] = useState(0);

  const handleSort = () => {
    const sortedLotteries = lotteries
      .filter((lottery) => lottery.wasDrawn)
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.correctlyGuessed - b.correctlyGuessed;
        } else {
          return b.correctlyGuessed - a.correctlyGuessed;
        }
      });
    setLotteries(sortedLotteries);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("player_name");
    const storedBalance = localStorage.getItem("balance");
    const storedLotteries = JSON.parse(
      localStorage.getItem("lotteries") || "[]"
    );
    if (storedPlayerName) {
      setSavedPlayer(storedPlayerName);
      setBalance(storedBalance);
      setLotteries(storedLotteries);
    }
  }, []);

  useEffect(() => {
    const earnings = lotteries
      .filter((lottery) => lottery.wasDrawn && !lottery.generated)
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.prize,
        0
      );
    setTotalEarnings(earnings || 0);
  }, [lotteries]);

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
        const newLottery = {
          id: lotteryId,
          createdAt: Date.now(),
          numbers: selectedNumbers,
          generated: false,
          wasDrawn: false,
        };
        const updatedLotteries = [...lotteries, newLottery];
        localStorage.setItem("lotteries", JSON.stringify(updatedLotteries));
        setLotteries(updatedLotteries);
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

  const indexOfLastLottery = currentPage * lotteriesPerPage;
  const indexOfFirstLottery = indexOfLastLottery - lotteriesPerPage;
  const currentLotteries = lotteries
    .filter((lottery) => !lottery.generated)
    .slice(indexOfFirstLottery, indexOfLastLottery);

  const paginate = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <=
        Math.ceil(
          lotteries.filter((lottery) => !lottery.generated).length /
            lotteriesPerPage
        )
    ) {
      setCurrentPage(pageNumber);
    }
  };
  console.log(currentLotteries);

  return (
    <div className="bg-gray-900">
      <div className="flex justify-center h-screen pt-5">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="text-3xl text-white font-bold">Játékos</h1>
          <h2 className="text-xl text-white">Egyenleg: {balance} akcse</h2>
          <div className="flex justify-center w-screen space-x-3">
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
              <h1 className="text-3xl text-white font-bold mb-2">
                Megtett szelvényeim
              </h1>
              <h2 className="text-xl text-white font-bold mb-2">
                Összesített nyeremény: {totalEarnings} akcse
              </h2>
              <table className="border-collapse border border-white">
                <thead>
                  <tr>
                    <th className="border border-white p-2">Szelvény</th>
                    <th className="border border-white p-2">Létrehozva</th>
                    <th className="border border-white p-2">
                      <button
                        onClick={handleSort}
                        className="text-white font-bold"
                      >
                        Státusz {sortOrder === "asc" ? "▲" : "▼"}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentLotteries.map((lottery) => (
                    <tr key={lottery.id}>
                      <td className="border border-white p-2">
                        {lottery.numbers.join(", ")}
                      </td>
                      <td className="border border-white p-2">
                        {new Date(lottery.createdAt).toLocaleString()}
                      </td>
                      <td className="border border-white p-2">
                        {lottery.wasDrawn ? (
                          <>
                            <p className="text-green-500 font-bold">Sorsolva</p>
                            <p className="text-white">
                              Nyertes számok: {lottery.drawnNumbers.join(", ")}
                            </p>
                            <p className="text-white">
                              Találatok: {lottery.correctlyGuessed}
                            </p>
                            <p className="text-white">
                              Nyeremény: {lottery.prize} akcse
                            </p>
                          </>
                        ) : (
                          <p className="text-yellow-500">Sorsolásra vár</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <p className="text-white mx-4">
                  {currentPage} /{" "}
                  {Math.ceil(
                    lotteries.filter((lottery) => !lottery.generated).length /
                      lotteriesPerPage
                  )}
                </p>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
