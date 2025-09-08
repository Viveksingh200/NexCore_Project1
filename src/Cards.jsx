import React, { useEffect } from "react";
import {useState} from "react";

function Cards() {
  // const totalCards = Array.from({length:8}, (_,i) => i + 1);
  const cardImages = ["card1.png", "card2.png", "card3.png", "card4.png"];
  const suffleCards = () => [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);
  const [suffledCards, setSuffledCards] = useState(suffleCards());
  const [flipped, setFlipped] = useState(Array(suffledCards.length).fill(false));
  const [matched, setMatched] = useState(Array(suffledCards.length).fill(false));
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [previewing, setPreviewing] = useState(true);

  useEffect(() => {
    if(gameOver) return;
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    },1000);
    return() => clearInterval(interval);
  }, [gameOver])

  //show all cards once
  useEffect(() => {
    setFlipped(Array(suffledCards.length).fill(true));

    setTimeout(() => {
      setFlipped(Array(suffledCards.length).fill(false));
      setPreviewing(false); 
    }, 1000)
  }, [suffledCards]);


  // const flippedIndexes = flipped
  // .map((f, i) => (f && !matched[i] ? i : null))
  // .filter(i => i !== null);
  
  function handleFlip(index) {
    if(previewing || matched[index] || flipped[index]) return;

    let newFlipped = [...flipped]; //[false,false,false,false,false,false,false,false]
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);

    const newSelected = [...selectedCards, index]; 
    setSelectedCards(newSelected);

    if(newSelected.length === 2){
      const [firstIdx, secondIdx] = newSelected;
      if(suffledCards[firstIdx] === suffledCards[secondIdx]){
        const newMatched = [...matched];
        newMatched[firstIdx] = true;
        newMatched[secondIdx] = true;
        setMatched(newMatched);
        setScore((prev) => prev + 1);
        setSelectedCards([]);
        if (newMatched.every((m) => m)) setGameOver(true);
      } else {
        setTimeout(() => {
          const resetFlipped = [...flipped];
          resetFlipped[firstIdx] = false;
          resetFlipped[secondIdx] = false;
          setFlipped(resetFlipped);
          setSelectedCards([]);
        }, 1000);
      }
    }
  }

  
  // Reset the game
  const resetGame = () => {
  const newShuffled = suffleCards();
  setSuffledCards(newShuffled);
  setFlipped(Array(newShuffled.length).fill(false));
  setMatched(Array(newShuffled.length).fill(false));
  setSelectedCards([]);
  setScore(0);
  setTime(0);
  setGameOver(false);
  setPreviewing(true);
};

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">Memory Card Game</h1>
      <div className="flex items-center justify-between w-full max-w-md bg-white/20 backdrop-blur-md rounded-lg px-6 py-3 text-white mb-6">
        <span className="font-semibold">Time: {time}s</span>
        <span className="font-semibold">Score: {score}/{cardImages.length}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 bg-white/10 p-6 rounded-2xl shadow-2xl">
        {suffledCards.map((img, index) => (
          <div className="w-24 h-32 cursor-pointer perspective" onClick={() => handleFlip(index)} key={index}>
            {flipped[index] || matched[index] ? 
            
            (
              <img  src={`images/${img}`} className="w-20 h-28 object-contain" />
            ) : (
              <img src={`images/card_back.png`} className="w-20 h-28 object-contain" />
            )}
          </div>
        ))}

      </div>
      {gameOver && (
        <div className="mt-6 text-2xl font-bold text-yellow-300 animate-bounce">
          🎉 You Win in {time}s with {score} points! 🎉
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-md hover:bg-yellow-500 transition"
      >
        Reset Game
      </button>
      </div>
    </>
  );
}

export default Cards;