import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessGameReview = () => {
  const [game, setGame] = useState(new Chess());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [selectedGameMoves, setSelectedGameMoves] = useState([]);
  const [currentGameDetails, setCurrentGameDetails] = useState("");

  const gamesData = [
    {
      name: "Kasparov vs Topalov (1999)",
      moves: ["e4", "d6", "d4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "Qd2", "c6", "f3", 
        "b5", "Nge2", "Nbd7", "Bh6", "Bxh6", "Qxh6", "Bb7", "a3", "e5", "O-O-O", "Qe7", 
        "Kb1", "a6", "Nc1", "O-O-O", "Nb3", "exd4", "Rxd4", "c5", "Rd1", "Nb6", "g3", 
        "Kb8", "Na5", "Ba8", "Bh3", "d5", "Qf4+", "Ka7", "Rhe1", "d4", "Nd5", "Nb6xd5", 
        "exd5", "Qd6", "Rxd4", "cxd4", "Re7+", "Kb6", "Qxd4+", "Ka5", "b4+", "Ka4", "Qc3", 
        "Qxd5", "Ra7", "Bb7", "Rxb7", "Qc4", "Qxf6", "Kxa3", "Qxa6+", "Kxb4", "c3+", 
        "Kxc3", "Qa1+", "Kd2", "Qb2+", "Kd1", "Bf1", "Rd2", "Rd7", "Rxd7", "Bxc4", "bxc4", 
        "Qxh8", "Rd3", "Qa8", "c3", "Qa4+", "Ke1", "f4", "f5", "Kc1", "Rd2", "Qa7"],
        details: "White: Kasparov ; Black: Topalov ; Score: 1-0"
    },
    {
      name: "Fischer vs Spassky (1972)",
      moves: ["c4", "e6", "Nf3", "d5", "d4", "Nf6", "Nc3", "Be7", "Bg5", "O-O", "e3", 
        "h6", "Bh4", "b6", "cxd5", "Nxd5", "Bxe7", "Qxe7", "Nxd5", "exd5", "Rc1", 
        "Be6", "Qa4", "c5", "Qa3", "Rc8", "Bb5", "a6", "dxc5", "bxc5", "O-O", 
        "Ra7", "Be2", "Nd7", "Nd4", "Qf8", "Nxe6", "fxe6", "e4", "d4", "f4", 
        "Qe7", "e5", "Rb8", "Bc4", "Kh8", "Qh3", "Nf8", "b3", "a5", "f5", 
        "exf5", "Rxf5", "Nh7", "Rcf1", "Qd8", "Qg3", "Re7", "h4", "Rbb7", 
        "e6", "Rbc7", "Qe5", "Qe8", "a4", "Qd8", "R1f2", "Qe8", "R2f3", 
        "Qd8", "Bd3", "Qe8", "Qe4", "Nf6", "Rxf6", "gxf6", "Rxf6", "Kg8", 
        "Bc4", "Kh8", "Qf4"],
        details: "White: Fischer ; Black: Spassky ; Score: 1-0"       
    },
    {
      name: "Tal vs Botvinnik (1960)",
      moves: [
        "e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6", 
        "N1e2", "Nd7", "h4", "h6", "Nf4", "Bh7", "Bc4", "e5", "Qe2", "Qe7", 
        "dxe5", "Qxe5", "Be3", "Bc5", "Bxc5", "Qxe2+", "Kxe2", "Nxc5", "Rhe1", 
        "Nf6", "b4", "Ncd7", "Kf1+", "Kf8", "Bb3", "g5", "hxg5", "hxg5", 
        "Nh3", "Rg8", "Red1", "a5", "bxa5", "Rxa5", "Rd6", "Ke7", "Rad1", 
        "Re5", "Nh5", "Bg6", "Rxd7+", "Nxd7", "Rxd7+", "Kxd7", "Nf6+", 
        "Kd6", "Nxg8", "Rc5", "Nh6", "f6", "Ng4", "Bxc2", "Nxf6", "Bxb3", 
        "axb3", "Rb5", "Nxg5", "Rxb3", "f4", "Rb1+", "Ke2", "Rb2+", "Kf3", 
        "Rb3+", "Kg4", "Rb2", "g3", "b5", "Nfe4+", "Kd5", "f5", "b4", 
        "f6", "Ra2", "f7", "Ra8", "Nh7", "b3", "Nd2", "b2", "Kf3", "Kd4", 
        "Ke2", "c5", "f8=Q", "Rxf8", "Nxf8", "c4", "Ne6+", "Kd5", "Nf4+", 
        "Kd4", "Nb1"],
        details: "White: Tal ; Black: Botvinnik ; Score: 1-0"
    },
    {
      name: "Carlsen vs Anand (2013)",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6", "d3", "Bc5", "O-O", "d6", "Re1", 
        "O-O", "Bxc6", "bxc6", "h3", "Re8", "Nbd2", "Nd7", "Nc4", "Bb6", "a4", 
        "a5", "Nxb6", "cxb6", "d4", "Qc7", "Ra3", "Nf8", "dxe5", "dxe5", "Nh4", 
        "Rd8", "Qh5", "f6", "Nf5", "Be6", "Rg3", "Ng6", "h4", "Bxf5", "exf5", 
        "Nf4", "Bxf4", "exf4", "Rc3", "c5", "Re6", "Rab8", "Rc4", "Qd7", "Kh2", 
        "Rf8", "Rce4", "Rb7", "Qe2", "b5", "b3", "bxa4", "bxa4", "Rb4", "Re7", 
        "Qd6", "Qf3", "Rxe4", "Qxe4", "f3", "g3", "h5", "Qb7"],
        details: "White: Carlsen ; Black: Anand ; Score: 1-0"      
    },
    {
      name: "Byrne vs Fischer (1956)",
      moves: ["Nf3", "Nf6", "c4", "g6", "Nc3", "Bg7", "d4", "O-O", "Bf4", "d5", "Qb3", "dxc4", "Qxc4", "c6", 
        "e4", "Nbd7", "Rd1", "Nb6", "Qc5", "Bg4", "Bg5", "Na4", "Qa3", "Nxc3", "bxc3", "Nxe4", "Bxe7", "Qb6", 
        "Bc4", "Nxc3", "Bc5", "Rfe8+", "Kf1", "Be6", "Bxb6", "Bxc4+", "Kg1", "Ne2+", "Kf1", "Nxd4+", "Kg1", 
        "Ne2+", "Kf1", "Nc3+", "Kg1", "axb6", "Qb4", "Ra4", "Qxb6", "Nxd1", "h3", "Rxa2", "Kh2", "Nxf2", "Re1", 
        "Rxe1", "Qd8+", "Bf8", "Nxe1", "Bd5", "Nf3", "Ne4", "Qb8", "b5", "h4", "h5", "Ne5", "Kg7", "Kg1", "Bc5+", 
        "Kf1", "Ng3+", "Ke1", "Bb4+", "Kd1", "Bb3+", "Kc1", "Ne2+", "Kb1", "Nc3+", "Kc1", "Rc2"],
        details: "White: Byrne ; Black: Fischer ; Score: 0-1"
    },
    {
      name: "Karpov vs Kasparov (1985)",
      moves: ["e4", "c5", "Nf3", "e6", "d4", "cxd4", "Nxd4", "Nc6", "Nb5", "d6", "c4", "Nf6", "N1c3", "a6", "Na3",
        "d5", "cxd5", "exd5", "exd5", "Nb4", "Be2", "Bc5", "O-O", "O-O", "Bf3", "Bf5", "Bg5", "Re8", "Qd2", "b5",
        "Rad1", "Nd3", "Nab1", "h6", "Bh4", "b4", "Na4", "Bd6", "Bg3", "Rc8", "b3", "g5", "Bxd6", "Qxd6", "g3", "Nd7",
        "Bg2", "Qf6", "a3", "a5", "axb4", "axb4", "Qa2", "Bg6", "d6", "g4", "Qd2", "Kg7", "f3", "Qxd6", "fxg4", "Qd4+",
        "Kh1", "Nf6", "Rf4", "Ne4", "Qxd3", "Nf2+", "Rxf2", "Bxd3", "Rfd2", "Qe3", "Rxd3", "Rc1", "Nb2", "Qf2","Nd2", 
        "Rxd1+", "Nxd1", "Re1+"],
        details: "White: Karpov ; Black: Kasparov ; Score: 0-1"
    },    
    {
      name: "Aronian vs Anand (2013)",
      moves: [
        "d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "e6", "e3", "Nbd7", "Bd3", 
        "dxc4", "Bxc4", "b5", "Bd3", "Bd6", "O-O", "O-O", "Qc2", "Bb7", "a3", 
        "Rc8", "Ng5", "c5", "Nxh7", "Ng4", "f4", "cxd4", "exd4", "Bc5", "Be2", 
        "Nde5", "Bxg4", "Bxd4+", "Kh1", "Nxg4", "Nxf8", "f5", "Ng6", "Qf6", "h3", 
        "Qxg6", "Qe2", "Qh5", "Qd3", "Be3"],
        details: "White: Aronian ; Black: Anand ; Score: 0-1"
    },
    {
      name: "Ivanchuk vs Yusupov (1991)",
      moves: [
        "c4", "e5", "g3", "d6", "Bg2", "g6", "d4", "Nd7", "Nc3", "Bg7", "Nf3", "Ngf6", 
        "O-O", "O-O", "Qc2", "Re8", "Rd1", "c6", "b3", "Qe7", "Ba3", "e4", "Ng5", 
        "e3", "f4", "Nf8", "b4", "Bf5", "Qb3", "h6", "Nf3", "Ng4", "b5", "g5", 
        "bxc6", "bxc6", "Ne5", "gxf4", "Nxc6", "Qg5", "Bxd6", "Ng6", "Nd5", "Qh5", 
        "h4", "Nxh4", "gxh4", "Qxh4", "Nde7+", "Kh8", "Nxf5", "Qh2+", "Kf1", 
        "Re6", "Qb7", "Rg6", "Qxa8+", "Kh7", "Qg8+", "Kxg8", "Nce7+", "Kh7", 
        "Nxg6", "fxg6", "Nxg7", "Nf2", "Bxf4", "Qxf4", "Ne6", "Qh2", "Rdb1", 
        "Nh3", "Rb7+", "Kh8", "Rb8+", "Qxb8", "Bxh3", "Qg3"],
        details: "White: Ivanchuk ; Black: Yusupov ; Score: 0-1"
    },
    {
      name: "Short vs Timman (1991)",
      moves: [
        "e4", "Nf6", "e5", "Nd5", "d4", "d6", "Nf3", "g6", "Bc4", "Nb6", "Bb3", 
        "Bg7", "Qe2", "Nc6", "O-O", "O-O", "h3", "a5", "a4", "dxe5", "dxe5", 
        "Nd4", "Nxd4", "Qxd4", "Re1", "e6", "Nd2", "Nd5", "Nf3", "Qc5", "Qe4", 
        "Qb4", "Bc4", "Nb6", "b3", "Nxc4", "bxc4", "Re8", "Rd1", "Qc5", "Qh4", 
        "b6", "Be3", "Qc6", "Bh6", "Bh8", "Rd8", "Bb7", "Rad1", "Bg7", "R8d7", 
        "Rf8", "Bxg7", "Kxg7", "R1d4", "Rae8", "Qf6+", "Kg8", "h4", "h5", 
        "Kh2", "Rc8", "Kg3", "Rce8", "Kf4", "Bc8", "Kg5"],
        details: "White: Short ; Black: Timman ; Score: 1-0"
    },
    {
      name: "Gukesh vs Carlsen (2022)",
      moves: [
        "e4", "e6", "d4", "d5", "Nc3", "Nf6", "e5", "Nfd7", "f4", "c5", "Nf3", 
        "Nc6", "Be3", "a6", "Qd2", "b5", "dxc5", "Bxc5", "Bxc5", "Nxc5", 
        "Bd3", "Qb6", "Qf2", "b4", "Ne2", "a5", "O-O", "Ba6", "f5", "exf5", 
        "Nf4", "Ne7", "e6", "f6", "Rac1", "O-O", "c3", "Qd6", "Bxa6", "Rxa6", 
        "cxb4", "Ne4", "Qe3", "axb4", "Nd4", "Rxa2", "Nb5", "Qe5", "Rc7", 
        "Re8", "Qb6", "Ng5", "Rxe7", "Rea8", "Qc7", "Qe3+", "Kh1"],
        details: "White: Gukesh ; Black: Carlsen ; Score: 1-0"
    }
  ];

  useEffect(() => {
    handleGameSelection(0);
  }, []);

  const goToMove = (index) => {
    if (index >= 0 && index <= selectedGameMoves.length) {
      const newGame = new Chess();
      try {
        for (let i = 0; i < index; i++) {
          const move = selectedGameMoves[i];
          const result = newGame.move(move);
          if (!result) {
            console.error(`Invalid move "${move}" at index ${i}`);
            break;
          }
        }
        setGame(newGame);
        setCurrentMoveIndex(index);
      } catch (error) {
        console.error(`Error applying moves up to index ${index}:`, error);
      }
    } else {
      console.error(`Invalid index: ${index}`);
    }
  };

  const handleNextMove = () => {
    if (currentMoveIndex < selectedGameMoves.length) {
      goToMove(currentMoveIndex + 1);
    }
  };

  const handlePreviousMove = () => {
    if (currentMoveIndex > 0) {
      goToMove(currentMoveIndex - 1);
    }
  };

  const handleStartPosition = () => {
    goToMove(0);
  };

  const handleGameSelection = (gameIndex) => {
    const selectedGame = gamesData[gameIndex];
    setSelectedGameMoves(selectedGame.moves);
    setCurrentGameDetails(selectedGame.details);
    goToMove(0);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', padding: '50px', background: 'grey', color: '#333', fontFamily: '"Helvetica Neue", Arial, sans-serif', height: '100vh', width: '99vw', boxSizing: 'border-box' }}>
      <h1 style={{ background: '#333', color: 'white', padding: '10px', textAlign: 'center', fontSize: '1.5em'}}>Well-Known Chess Games Analysis</h1>
      <div style={{ display: 'flex', flex: 1, gap: '20px', height: 'calc(100% - 60px)' }}>
        <div style={{ flex: '0.8', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '19px', color: '#050301' }}>Games</h3>
          {gamesData.map((game, i) => (
            <button
              key={i}
              style={{
                display: 'block',
                width: '100%',
                margin: '8px 0',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                background: '#f8f9fa',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '16px'
              }}
              onClick={() => handleGameSelection(i)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {game.name}
            </button>
          ))}
        </div>

        <div style={{ flex: '1', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ marginBottom: '10px', fontSize: '19px', fontWeight: 'bold', color: '#333' }}>
            {currentGameDetails}
          </div>
          <Chessboard
            position={game.fen()}
            boardWidth={510}
            boardStyle={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}
            onPieceDrop={(sourceSquare, targetSquare) => {
              const gameCopy = new Chess(game.fen());
              const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
              });

              if (move) {
                setGame(gameCopy);
                setCurrentMoveIndex((prevIndex) => prevIndex + 1);
              } else {
                console.warn("Invalid move attempted:", sourceSquare, targetSquare);
              }
            }}
          />
          <div style={{ marginTop: '8px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={handlePreviousMove} disabled={currentMoveIndex === 0} style={{ padding: '12px 10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', transition: 'all 0.3s', width: '150px' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#A9A9A9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333'}>
              Previous Move
            </button>
            <button onClick={handleNextMove} disabled={currentMoveIndex >= selectedGameMoves.length} style={{ padding: '12px 10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', transition: 'all 0.3s', width: '150px' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#A9A9A9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333'}>
              Next Move
            </button>
            <button onClick={handleStartPosition} style={{ padding: '12px 10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', transition: 'all 0.3s', width: '150px' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#A9A9A9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333'}>
              Start Position
            </button>
          </div>
        </div>
        {/* Score Sheet */}
        <div style={{
          flex: '1',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          background: 'white',
          marginLeft: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '19px', color: '#050301' }}>Moves</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f8f9fa', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>S.No</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f8f9fa', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>White</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f8f9fa', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Black</th>
              </tr>
            </thead>
            <tbody>
              {selectedGameMoves.reduce((rows, move, index) => {
                if (index % 2 === 0) {
                  rows.push([move]);
                } else {
                  rows[rows.length - 1].push(move);
                }
                return rows;
              }, []).map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f2f2f2', cursor: 'pointer', transition: 'all 0.3s' }}>

                  <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '15px', color: '#555' }}>{i + 1}</td>
                  <td
                    style={{ border: '1px solid #ddd', padding: '8px', color: '#333', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                    onClick={() => goToMove(i * 2 + 1)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f2f2f2'}
                  >
                    {row[0]}
                  </td>
                  <td
                    style={{ border: '1px solid #ddd', padding: '8px', color: '#333', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                    onClick={() => goToMove(i * 2 + 2)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f2f2f2'}
                  >
                    {row[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChessGameReview;
