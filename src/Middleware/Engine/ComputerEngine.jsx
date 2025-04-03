
import Engine from "./StockfishEngine";
const engine = new Engine();

export function findBestMove(FEN, DEPTH = 1) {
  return new Promise((resolve) => {
    engine.evaluatePosition(FEN, DEPTH);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        //console.log(bestMove);
        resolve(bestMove);
      }
    });
  });
}

