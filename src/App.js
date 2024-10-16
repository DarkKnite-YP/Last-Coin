import React, { useState } from "react";
import './App.css'; // Import the CSS file

const minimax = (coins, isMaximizing) => {
  // Base case: If there are no coins left, the game is over
  if (coins === 0) {
    return isMaximizing ? -1 : 1; // If it's the maximizing player's turn, they lose, so return -1
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let move = 1; move <= 3; move++) {
      if (coins - move >= 0) {
        let score = minimax(coins - move, false);
        bestScore = Math.max(bestScore, score); // AI tries to maximize its chances
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let move = 1; move <= 3; move++) {
      if (coins - move >= 0) {
        let score = minimax(coins - move, true);
        bestScore = Math.min(bestScore, score); // Player tries to minimize AI's chances
      }
    }
    return bestScore;
  }
};


const findBestMove = (coins) => {
  let bestMove = -1;

  // Check specific end-game scenarios
  if (coins === 1) {
    bestMove = 1; // AI takes the last coin to win
  } else if (coins === 2) {
    bestMove = 1; // AI takes 1 coin, leaving 1 for the player
  } else if (coins === 3) {
    bestMove = 2; // AI takes 2 coins, leaving 1 for the player
  } else {
    // For more than 3 coins, use minimax to decide the best move
    let bestScore = -Infinity;

    for (let move = 1; move <= 3; move++) {
      if (coins - move >= 0) {
        let score = minimax(coins - move, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }
  }

  return bestMove;
};


const CoinGame = () => {
  const [coins, setCoins] = useState(10);
  const [message, setMessage] = useState("Your turn! Pick 1, 2, or 3 coins.");
  const [gameOver, setGameOver] = useState(false);

  const handlePlayerMove = (move) => {
    if (gameOver) return;
    if (move > coins || move < 1) {
      setMessage(`Invalid move. You can take between 1 and 3 coins.`);
      return;
    }

    setCoins((prevCoins) => prevCoins - move);
    if (coins - move === 0) {
      setMessage("You took the last coin! You lose!");
      setGameOver(true);
      return;
    }

    // AI's turn
    const aiMove = findBestMove(coins - move);
    setTimeout(() => {
      setCoins((prevCoins) => prevCoins - aiMove);
      if (coins - move - aiMove === 0) {
        setMessage("AI took the last coin! AI loses, you win!");
        setGameOver(true);
      } else {
        setMessage(`AI picked ${aiMove} coin(s). Your turn!`);
      }
    }, 1000);
  };

  const resetGame = () => {
    setCoins(10);
    setMessage("Your turn! Pick 1, 2, or 3 coins.");
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Coin Game</h1>
      <h2 className="coins-remaining">{coins} coins remaining</h2>
      <div className="coins-container">
        {Array(coins).fill(0).map((_, index) => (
          <div key={index} className="coin"></div>
        ))}
      </div>
      <p className="message">{message}</p>
      <div className="button-container">
        {[1, 2, 3].map((move) => (
          <button
            key={move}
            onClick={() => handlePlayerMove(move)}
            disabled={gameOver || coins < move}
            className="move-button"
          >
            Take {move} coin(s)
          </button>
        ))}
      </div>
      {gameOver && (
        <button onClick={resetGame} className="reset-button">
          Play Again
        </button>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <CoinGame />
    </div>
  );
};

export default App;
