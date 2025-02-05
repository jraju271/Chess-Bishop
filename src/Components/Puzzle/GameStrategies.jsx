import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import Confetti from "react-confetti";

const GameStrategies = () => {
  const [game, setGame] = useState(new Chess());
  const [scenario, setScenario] = useState("attacking"); // Default scenario
  const [status, setStatus] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);

  // Scenarios and moves definition
  const scenarios = {
    attacking: {
      fen: "rnbqkbnr/pppppppp/8/2b5/4N3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Corrected FEN for white knight attacking black bishop
      description: "Use your knight to attack the black bishop at c5. This strategy demonstrates how to place pressure on your opponent's key pieces.",
      moves: [
        { from: "e4", to: "c5", message: "Great start! You've attacked the bishop." },
      ],
    },
    capturing: {
      fen: "rnbqkbnr/pppppppp/8/8/4n3/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1", // Corrected FEN for capturing scenario
      description: "Capture the black knight on e5 using your knight at f3. This move demonstrates how to seize control by capturing key pieces.",
      moves: [
        { from: "f3", to: "e5", message: "Excellent! You've captured the black knight." },
      ],
    },
    exchanges: {
      fen: "rnbqkbnr/pppppppp/8/2b5/4N3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Corrected FEN for favorable exchange
      description:
        "Trade your knight at e4 for the black bishop at c5. This strategy illustrates how to perform favorable exchanges that improve your position.",
      moves: [
        { from: "e4", to: "c5", message: "Good! You've completed a favorable exchange." },
      ],
    },
  };

  // Update board state and status when the scenario changes
  useEffect(() => {
    const selectedScenario = scenarios[scenario];
    const newGame = new Chess(selectedScenario.fen);
    setGame(newGame);
    setMoveIndex(0);
    setStatus(selectedScenario.description);
    setShowConfetti(false); // Reset confetti on scenario change
  }, [scenario]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const selectedScenario = scenarios[scenario];
    const currentMove = selectedScenario.moves[moveIndex];
    const move = game.move({ from: sourceSquare, to: targetSquare });

    if (!move) {
      setStatus("Incorrect move! Try again.");
      return;
    }

    if (sourceSquare === currentMove.from && targetSquare === currentMove.to) {
      setMoveIndex((prev) => prev + 1);
      if (moveIndex + 1 === selectedScenario.moves.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Confetti disappears after 3 seconds
        setStatus("🎉 Hooray! You've successfully completed the strategy! 🎉");
      } else {
        setStatus(currentMove.message);
      }
    } else {
      setStatus("Incorrect move! Try again.");
    }
    setGame(new Chess(game.fen()));
  };

  const resetBoard = () => {
    const selectedScenario = scenarios[scenario];
    const newGame = new Chess(selectedScenario.fen);
    setGame(newGame);
    setMoveIndex(0);
    setStatus(selectedScenario.description);
    setShowConfetti(false);
  };

  return (
    <div className="game-strategies-container">
      {showConfetti && <Confetti recycle={false} />}
      <div className="game-box">
        <h1>Game Strategies and Objectives</h1>
        <div className="strategy-selector">
          <button
            className={scenario === "attacking" ? "active" : ""}
            onClick={() => setScenario("attacking")}
          >
            Attacking
          </button>
          <button
            className={scenario === "capturing" ? "active" : ""}
            onClick={() => setScenario("capturing")}
          >
            Capturing
          </button>
          <button
            className={scenario === "exchanges" ? "active" : ""}
            onClick={() => setScenario("exchanges")}
          >
            Favorable Exchanges
          </button>
        </div>
        <div className="board-section">
          <Chessboard
            position={game.fen()}
            onDrop={onDrop}
            draggable
            orientation="white"
            width={400}
          />
        </div>
        <div className="strategy-selector">
          <br></br>
          <button onClick={resetBoard}>Reset Board</button>
        </div>
        <div className="status-box">
          <h3>Scenario Description:</h3>
          <p>{status}</p>
        </div>
      </div>

      {/* Styling */}
      <style>{`
        .game-strategies-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
        .game-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 500px;
          max-width: 100%;
          text-align: center;
        }
        .strategy-selector button {
          margin: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .strategy-selector button.active {
          background-color: #007bff;
          color: white;
        }
        .board-section {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        .status-box {
          margin-top: 20px;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default GameStrategies;
