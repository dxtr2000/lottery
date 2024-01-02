import React, { useEffect, useState } from "react";

const Operator = () => {
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("simulate");
  const [numTickets, setNumTickets] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  const handleSort = (column) => {
    if (sortColumn === column) {
      // If the same column is clicked again, reverse the sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set the sort column and direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort the rounds based on the selected column and direction
  const sortedRounds = JSON.parse(localStorage.getItem("rounds") || "[]").sort(
    (a, b) => {
      if (sortColumn === "round") {
        return sortDirection === "asc" ? a.round - b.round : b.round - a.round;
      } else if (sortColumn === "winningTickets") {
        return sortDirection === "asc"
          ? a.report.winningTickets - b.report.winningTickets
          : b.report.winningTickets - a.report.winningTickets;
      } else if (sortColumn === "fourMatchTickets") {
        return sortDirection === "asc"
          ? a.report.fourMatchTickets - b.report.fourMatchTickets
          : b.report.fourMatchTickets - a.report.fourMatchTickets;
      } else if (sortColumn === "threeMatchTickets") {
        return sortDirection === "asc"
          ? a.report.threeMatchTickets - b.report.threeMatchTickets
          : b.report.threeMatchTickets - a.report.threeMatchTickets;
      } else if (sortColumn === "twoMatchTickets") {
        return sortDirection === "asc"
          ? a.report.twoMatchTickets - b.report.twoMatchTickets
          : b.report.twoMatchTickets - a.report.twoMatchTickets;
      } else if (sortColumn === "nonWinningTickets") {
        return sortDirection === "asc"
          ? a.report.nonWinningTickets - b.report.nonWinningTickets
          : b.report.nonWinningTickets - a.report.nonWinningTickets;
      } else if (sortColumn === "totalTickets") {
        return sortDirection === "asc"
          ? a.report.totalTickets - b.report.totalTickets
          : b.report.totalTickets - a.report.totalTickets;
      } else if (sortColumn === "totalRevenue") {
        return sortDirection === "asc"
          ? a.report.totalRevenue - b.report.totalRevenue
          : b.report.totalRevenue - a.report.totalRevenue;
      } else if (sortColumn === "totalPayout") {
        return sortDirection === "asc"
          ? a.report.totalPayout - b.report.totalPayout
          : b.report.totalPayout - a.report.totalPayout;
      } else if (sortColumn === "operatorProfit") {
        return sortDirection === "asc"
          ? a.report.operatorProfit - b.report.operatorProfit
          : b.report.operatorProfit - a.report.operatorProfit;
      }
      return 0;
    }
  );

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

  const handleDraw = () => {
    const storedLotteries = JSON.parse(
      localStorage.getItem("lotteries") || "[]"
    );
    const drawnNumbers = [];
    while (drawnNumbers.length < 5) {
      const randomNumber = Math.floor(Math.random() * 90) + 1;
      if (!drawnNumbers.includes(randomNumber)) {
        drawnNumbers.push(randomNumber);
      }
    }
    const drawnLotteries = storedLotteries.map((lottery) => {
      if (lottery.wasDrawn) {
        return lottery;
      }
      const correctlyGuessed = lottery.numbers.filter((number) =>
        drawnNumbers.includes(number)
      ).length;
      let prize = 0;
      if (correctlyGuessed === 2) {
        prize = 750;
      } else if (correctlyGuessed === 3) {
        prize = 1250;
      } else if (correctlyGuessed === 4) {
        prize = 2000;
      } else if (correctlyGuessed === 5) {
        prize = 10000;
      }
      const operatorBalance = localStorage.getItem("operator_balance");
      const updatedBalance = parseInt(operatorBalance) - prize;
      if (!lottery.generated) {
        const playerBalance = localStorage.getItem("balance");
        const updatedPlayerBalance = parseInt(playerBalance) + prize;
        localStorage.setItem("balance", updatedPlayerBalance);
      }
      localStorage.setItem("operator_balance", updatedBalance);
      setBalance(updatedBalance);
      return {
        ...lottery,
        wasDrawn: true,
        drawnNumbers,
        correctlyGuessed,
        prize,
      };
    });
    localStorage.setItem("lotteries", JSON.stringify(drawnLotteries));
    alert(`${new Date().toLocaleString()} Draw Complete!`);
    window.location.reload();
    generateReport();
  };

  const generateReport = () => {
    const storedLotteries = JSON.parse(
      localStorage.getItem("lotteries") || "[]"
    );

    const winningTickets = storedLotteries.filter(
      (lottery) => lottery.correctlyGuessed === 5
    );
    const fourMatchTickets = storedLotteries.filter(
      (lottery) => lottery.correctlyGuessed === 4
    );
    const threeMatchTickets = storedLotteries.filter(
      (lottery) => lottery.correctlyGuessed === 3
    );
    const twoMatchTickets = storedLotteries.filter(
      (lottery) => lottery.correctlyGuessed === 2
    );
    const nonWinningTickets = storedLotteries.filter(
      (lottery) => lottery.correctlyGuessed === 0
    );

    const totalWinningPrize = winningTickets.reduce(
      (total, ticket) => total + ticket.prize,
      0
    );
    const totalFourMatchPrize = fourMatchTickets.reduce(
      (total, ticket) => total + ticket.prize,
      0
    );
    const totalThreeMatchPrize = threeMatchTickets.reduce(
      (total, ticket) => total + ticket.prize,
      0
    );
    const totalTwoMatchPrize = twoMatchTickets.reduce(
      (total, ticket) => total + ticket.prize,
      0
    );

    const totalTickets = storedLotteries.length;
    const totalRevenue = totalTickets * 500;
    const totalPayout =
      totalWinningPrize +
      totalFourMatchPrize +
      totalThreeMatchPrize +
      totalTwoMatchPrize;
    const operatorProfit = totalRevenue - totalPayout;

    const report = {
      winningTickets: winningTickets.length,
      fourMatchTickets: fourMatchTickets.length,
      threeMatchTickets: threeMatchTickets.length,
      twoMatchTickets: twoMatchTickets.length,
      nonWinningTickets: nonWinningTickets.length,
      totalWinningPrize,
      totalFourMatchPrize,
      totalThreeMatchPrize,
      totalTwoMatchPrize,
      totalTickets,
      totalRevenue,
      totalPayout,
      operatorProfit,
    };
    const rounds = JSON.parse(localStorage.getItem("rounds") || "[]");
    const currentRound = rounds.length + 1;
    localStorage.setItem(
      "rounds",
      JSON.stringify([...rounds, { round: currentRound, report }])
    );
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const storedLotteries = JSON.parse(localStorage.getItem("lotteries") || "[]");
  const currentTickets = storedLotteries.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNewGame = () => {
    localStorage.removeItem("balance");
    localStorage.removeItem("operator_balance");
    localStorage.removeItem("lotteries");
    localStorage.removeItem("rounds");
    localStorage.removeItem("player_name");
    window.location.reload();
  };

  const handleNewRound = () => {
    localStorage.removeItem("lotteries");
    localStorage.removeItem("rounds");
    window.location.reload();
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
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "draw"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-200"
              }`}
              onClick={() => handleTabChange("draw")}
            >
              Sorsolás
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "rounds"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-200"
              }`}
              onClick={() => handleTabChange("rounds")}
            >
              Eredmények
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "settings"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-200"
              }`}
              onClick={() => handleTabChange("settings")}
            >
              Beállítások
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
                <table className="border-collapse border border-white">
                  <thead>
                    <tr>
                      <th className="text-xl text-white border border-white p-2">
                        Szelvény azonosító
                      </th>
                      <th className="text-xl text-white border border-white p-2">
                        Mikor
                      </th>
                      <th className="text-xl text-white border border-white p-2">
                        Szelvény számai
                      </th>
                      <th className="text-xl text-white border border-white p-2">
                        Generált
                      </th>
                      <th className="text-xl text-white border border-white p-2">
                        Sorsolva lett
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {currentTickets.map((lottery) => (
                      <tr key={lottery.id}>
                        <td className="text-xl text-white border border-white p-2">
                          {lottery.id}
                        </td>
                        <td className="text-xl text-white border border-white p-2">
                          {new Date(lottery.createdAt).toLocaleString()}
                        </td>
                        <td className="text-xl text-white border border-white p-2">
                          {lottery.numbers.join(", ")}
                        </td>
                        <td className="text-xl text-white border border-white p-2">
                          {lottery.generated ? "Generálva" : "Nem generált"}
                        </td>
                        <td className="text-xl text-white border border-white p-2">
                          {lottery.wasDrawn ? "Igen" : "Még nem"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <p className="text-white mx-4">{currentPage}</p>
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
          {activeTab === "draw" && (
            <div className="space-y-3">
              <h1 className="text-3xl text-white font-bold mb-2">
                Sorsolásra váró szelvények száma
              </h1>
              <h2 className="text-xl text-white">
                {storedLotteries.filter((lottery) => !lottery.wasDrawn).length}{" "}
                darab
              </h2>

              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
                onClick={() => handleDraw()}
              >
                Sorsolás indítása
              </button>
            </div>
          )}
          {activeTab === "rounds" && (
            <div className="space-y-3">
              <h1 className="text-3xl text-white font-bold mb-2">
                Körök eredménye
              </h1>
              <div className="mt-4">
                <table className="p-8">
                  <thead>
                    <tr>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "round" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("round")}
                      >
                        Kör sorszáma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "winningTickets" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("winningTickets")}
                      >
                        Nyertes szelvények száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "fourMatchTickets"
                            ? "text-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSort("fourMatchTickets")}
                      >
                        4 találatos szelvények száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "threeMatchTickets"
                            ? "text-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSort("threeMatchTickets")}
                      >
                        3 találatos szelvények száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "twoMatchTickets"
                            ? "text-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSort("twoMatchTickets")}
                      >
                        2 találatos szelvények száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "nonWinningTickets"
                            ? "text-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSort("nonWinningTickets")}
                      >
                        Nem találatos szelvények száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "totalTickets" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("totalTickets")}
                      >
                        Összes szelvény száma
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "totalRevenue" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("totalRevenue")}
                      >
                        Bevétel
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "totalPayout" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("totalPayout")}
                      >
                        Kifizetés
                      </th>
                      <th
                        className={`text-xl text-white bg-gray-950 ${
                          sortColumn === "operatorProfit" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleSort("operatorProfit")}
                      >
                        Üzemeltető profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {sortedRounds.map((round) => (
                      <tr key={round.round}>
                        <td className="text-xl text-white">{round.round}</td>
                        <td className="text-xl text-white">
                          {round.report.winningTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.fourMatchTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.threeMatchTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.twoMatchTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.nonWinningTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.totalTickets}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.totalRevenue}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.totalPayout}
                        </td>
                        <td className="text-xl text-white">
                          {round.report.operatorProfit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="flex flex-col space-y-2">
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
                onClick={() => handleNewGame()}
              >
                Új játék
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
                onClick={() => handleNewRound()}
              >
                Új kör
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Operator;
