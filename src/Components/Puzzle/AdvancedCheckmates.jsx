import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import Confetti from "react-confetti";

const AdvancedCheckmates = () => {
  const [game, setGame] = useState(new Chess());
  const [checkmateType, setCheckmateType] = useState("basic");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Checkmate scenarios
  const checkmateScenarios = {
    basic: {
      name: "Basic Checkmate",
      scenarios: [
        {
          fen: "k7/7Q/8/8/8/8/8/K7 w - - 0 1",
          moves: [{ from: "h7", to: "b7" }],
          description:
            "The simplest form of checkmate is to use the queen to corner the opposing king. To complete this checkmate:\n1. Move the queen from h7 to b7 to deliver mate.",
        },
      ],
    },
    singleQueen: {
      name: "Single Queen Mate",
      scenarios: [
        {
          fen: "7k/7Q/8/8/8/8/8/K7 w - - 0 1",
          moves: [{ from: "h7", to: "g7" }],
          description:
            "The single queen mate is achieved by using the queen to restrict the king's movement and force it into a corner. Steps:\n1. Move the queen from h7 to g7 for a successful checkmate.",
        },
      ],
    },
    doubleRook: {
      name: "Double Rook Mate",
      scenarios: [
        {
          fen: "8/7k/8/8/8/8/6R1/6RK w - - 0 1",
          moves: [{ from: "g2", to: "g7" }],
          description:
            "The double rook checkmate uses two rooks to confine the black king. To complete:\n1. Move the rook from g2 to g7 to deliver the final checkmate.",
        },
      ],
    },
    bishopKnight: {
      name: "Bishop and Knight Mate",
      scenarios: [
        {
          fen: "7k/8/8/8/8/5N2/8/2B3K1 w - - 0 1",
          moves: [{ from: "f3", to: "g5" }],
          description:
            "The bishop and knight mate is one of the most challenging techniques. The pieces work together to corner the king. To complete:\n1. Move the knight from f3 to g5 to deliver checkmate.",
        },
      ],
    },
  };

  // Load a new scenario
  useEffect(() => {
    const currentScenario = checkmateScenarios[checkmateType].scenarios[scenarioIndex];
    const newGame = new Chess(currentScenario.fen);
    setGame(newGame);
    setSuccessMessage("");
    setShowConfetti(false);
  }, [checkmateType, scenarioIndex]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const currentScenario = checkmateScenarios[checkmateType].scenarios[scenarioIndex];
    const currentMove = currentScenario.moves[0];

    // Attempt the move
    const move = game.move({ from: sourceSquare, to: targetSquare });

    if (!move) {
      alert("Invalid move! Try again.");
      return;
    }

    // Check for success
    if (sourceSquare === currentMove.from && targetSquare === currentMove.to) {
      setSuccessMessage("🎉 Success! You have achieved the checkmate. 🎉");
      setShowConfetti(true);
      return;
    }

    // If incorrect but valid move
    setGame(new Chess(game.fen())); // Update board
    alert("Incorrect move! Try again.");
  };

  const resetBoard = () => {
    const currentScenario = checkmateScenarios[checkmateType].scenarios[scenarioIndex];
    const newGame = new Chess(currentScenario.fen);
    setGame(newGame);
    setSuccessMessage("");
    setShowConfetti(false);
  };

  return (
    <div className="advanced-checkmates-container">
      {showConfetti && <Confetti recycle={false} />}
      <div className="checkmate-box">
        <h1>Advanced Checkmates</h1>

        {/* Checkmate Type Selector */}
        <div className="checkmate-selector">
          {Object.keys(checkmateScenarios).map((key) => (
            <button
              key={key}
              className={checkmateType === key ? "active" : ""}
              onClick={() => {
                setCheckmateType(key);
                setScenarioIndex(0);
              }}
            >
              {checkmateScenarios[key].name}
            </button>
          ))}
        </div>

        {/* Scenario Selector
        <div className="scenario-selector">
          {checkmateScenarios[checkmateType].scenarios.map((_, index) => (
            <button
              key={index}
              className={scenarioIndex === index ? "active" : ""}
              onClick={() => setScenarioIndex(index)}
            >
              Scenario {index + 1}
            </button>
          ))}
        </div>*/}

        {/* Chessboard */}
        <div className="board-section">
          <Chessboard
            position={game.fen()}
            onDrop={onDrop}
            draggable
            orientation="white"
            width={400}
          />
        </div>

        {/* Description */}
        <div className="description-box">
          <h3>Description:</h3>
          <p>{successMessage || checkmateScenarios[checkmateType].scenarios[scenarioIndex].description}</p>
        </div>

        {/* Reset Button */}
        <button className="reset-button" onClick={resetBoard}>
          Reset Board
        </button>
      </div>

      {/* Styling */}
      <style>{`
        .advanced-checkmates-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
        .checkmate-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 600px;
          max-width: 100%;
          text-align: center;
        }
        .checkmate-selector, .scenario-selector {
          margin-bottom: 10px;
        }
        .checkmate-selector button, .scenario-selector button {
          margin: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .checkmate-selector button.active, .scenario-selector button.active {
          background-color: #007bff;
          color: white;
        }
        .board-section {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        .description-box {
          margin-top: 20px;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .reset-button {
          margin-top: 20px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AdvancedCheckmates;