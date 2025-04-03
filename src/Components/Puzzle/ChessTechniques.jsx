import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import Confetti from "react-confetti";

const ChessTechniques = () => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(""); // Current FEN
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [technique, setTechnique] = useState("castling"); // Default to castling

  useEffect(() => {
    resetBoard(); // Load the default technique
  }, [technique]);

  const getInitialFen = (technique) => {
    switch (technique) {
      case "castling":
        return "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"; // Castling-ready for both sides
      case "enpassant":
        return "rnbqkbnr/pppppppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1"; // En passant-ready
      case "promotion":
        return "7k/4P3/8/8/8/8/4p3/K7 w - - 0 1"; // Simplified and valid pawn promotion setup
      default:
        return "8/8/8/8/8/8/8/8 w - - 0 1";
    }
  };

  const resetBoard = () => {
    chess.reset();
    const initialFen = getInitialFen(technique);
    chess.load(initialFen); // Load the initial FEN
    setFen(initialFen);

    switch (technique) {
      case "castling":
        setMessage("Learn Castling: Move the king two squares toward the rook and the rook to the other side of the king.");
        break;
      case "enpassant":
        setMessage(
          "Learn En Passant: Move the white pawn from e5 to d6 to capture the black pawn on d5."
        );
        break;
      case "promotion":
        setMessage(
          "Learn Pawn Promotion: Move the pawn from e7 to e8 or e2 to e1 and promote it."
        );
        break;
      default:
        setMessage("");
    }
    setShowConfetti(false);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Default promotion to queen
    });

    if (move) {
      setFen(chess.fen());

      // Check for technique-specific success
      if (
        (technique === "castling" &&
          (move.san === "O-O" || move.san === "O-O-O")) ||
        (technique === "enpassant" && move.san.includes("exd6")) ||
        (technique === "promotion" && move.san.includes("="))
      ) {
        setMessage("Great! You successfully executed the technique!");
        setShowConfetti(true);

        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setMessage("Invalid move. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h2 style={styles.header}>Learn Chess Techniques</h2>

      <div style={styles.selector}>
        <button
          style={technique === "castling" ? styles.activeButton : styles.button}
          onClick={() => setTechnique("castling")}
        >
          Castling
        </button>
        <button
          style={technique === "enpassant" ? styles.activeButton : styles.button}
          onClick={() => setTechnique("enpassant")}
        >
          En Passant
        </button>
        <button
          style={technique === "promotion" ? styles.activeButton : styles.button}
          onClick={() => setTechnique("promotion")}
        >
          Pawn Promotion
        </button>
      </div>

      <p style={styles.instructions}>{message}</p>

      <div style={styles.boardContainer}>
        <Chessboard
          position={fen}
          onDrop={onDrop}
          draggable={true}
          width={400}
          orientation="white"
        />
      </div>

      <button onClick={resetBoard} style={styles.resetButton}>
        Reset Board
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "600px",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  selector: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  activeButton: {
    backgroundColor: "#0056b3",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  instructions: {
    fontSize: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },
  boardContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  resetButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ChessTechniques;
