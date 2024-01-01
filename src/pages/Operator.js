import React, { useEffect, useState } from "react";

const Operator = () => {
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("simulate");
  const [numTickets, setNumTickets] = useState();

  useEffect(() => {
    const storedBalance = localStorage.getItem("operator_balance");
    if (storedBalance) {
      setBalance(parseInt(storedBalance));
    } else {
      localStorage.setItem("operator_balance", 0);
      setBalance(0);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const generateLotteryId = () => {
    return Math.random().toString(36).substring(2, 32);
  };

  const generateLotteryTickets = (numTickets) => {
    const newTickets = [];
    for (let i = 0; i < numTickets; i++) {
      const ticketNumbers = [];
      while (ticketNumbers.length < 5) {
        const randomNumber = Math.floor(Math.random() * 90) + 1;
        if (!ticketNumbers.includes(randomNumber)) {
          ticketNumbers.push(randomNumber);
        }
      }
      newTickets.push({
        id: generateLotteryId(),
        numbers: ticketNumbers,
        createdAt: Date.now(),
        generated: true,
        wasDrawn: false,
      });
    }
    const updatedBalance = balance + 500 * numTickets;
    setBalance(updatedBalance);
    localStorage.setItem("operator_balance", updatedBalance);
    const storedLotteries = JSON.parse(
      localStorage.getItem("lotteries") || "[]"
    );
    localStorage.setItem(
      "lotteries",
      JSON.stringify([...storedLotteries, ...newTickets])
    );
  };

  return (
    <div className="bg-gray-900">
      <div className="flex justify-center h-screen pt-5">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="text-3xl text-white font-bold">Üzemeltető</h1>
          <h2 className="text-xl text-white">Egyenleg: {balance} akcse</h2>
          <div className="flex justify-center w-screen space-x-3">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "simulate"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-200"
              }`}
              onClick={() => handleTabChange("simulate")}
            >
              Játékos szimulálása
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "lotteries"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-200"
              }`}
              onClick={() => handleTabChange("lotteries")}
            >
              Összes szelvény
            </button>
          </div>
          {activeTab === "simulate" && (
            <div className="flex flex-col w-1/4 space-y-2">
              <input
                className="
                px-4
                py-2
                rounded-md
                bg-gray-500
                text-white
                placeholder-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                
              "
                type="number"
                min="1"
                placeholder="Generálandó szelvények száma"
                onChange={(e) => {
                  setNumTickets(e.target.value);
                }}
              />
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
                onClick={() => generateLotteryTickets(numTickets)}
              >
                Generálás
              </button>
            </div>
          )}
          {activeTab === "lotteries" && (
            <div className="flex flex-col space-y-2">
              <div className="mt-4">
                <table className="p-8">
                  <thead>
                    <tr>
                      <th className="text-xl text-white bg-gray-950">
                        Szelvény azonosító
                      </th>
                      <th className="text-xl text-white bg-gray-950">Mikor</th>
                      <th className="text-xl text-white bg-gray-950">
                        Szelvény számai
                      </th>
                      <th className="text-xl text-white bg-gray-950">
                        Generált
                      </th>
                      <th className="text-xl text-white bg-gray-950">
                        Sorsolva lett
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {JSON.parse(localStorage.getItem("lotteries") || "[]").map(
                      (lottery) => (
                        <tr key={lottery.id}>
                          <td className="text-xl text-white">{lottery.id}</td>
                          <td className="text-xl text-white">
                            {new Date(lottery.createdAt).toLocaleString()}
                          </td>
                          <td className="text-xl text-white">
                            {lottery.numbers.join(", ")}
                          </td>
                          <td className="text-xl text-white">
                            {lottery.generated ? "Generálva" : "Nem generált"}
                          </td>
                          <td className="text-xl text-white">
                            {lottery.wasDrawn ? "Igen" : "Még nem"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Operator;
