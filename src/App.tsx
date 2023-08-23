import { useState } from "react";

import Hand from "./Hand";
import "./App.css"

const DECKS = 6;

export default function App() {
  const [_, setDeck] = useState(newDeck(DECKS));
  const [discarded, setDiscarded] = useState(0);

  const [dealerCards, setDealerCards] = useState([]);
  const [holeCard, setHoleCard] = useState();
  const [cards, setCards] = useState<string[]>([]);

  function newDeck(decks: number): string[] {
    const values = "23456789XJQKA";
    const suits = "SDCH";

    const deck: string[] = [];
    for (let i = 0; i < decks; ++i) {
      for (const suit of suits) {
        for (const value of values) {
          deck.push(value + suit);
        }
      }
    }

    // Shuffle using the Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  function drawCard(callback: (card: string | undefined) => void) {
    setDeck((curDeck: string[]): string[] => {
      callback(curDeck[curDeck.length - 1]);
      return curDeck.slice(0, -1);
    });
  }

  function hit() {
    drawCard((card: string | undefined) => {
      if (card) {
        setCards([...cards, card]);
      }
    });
  }

  function clearTable() {
    let cardsInPlay = cards.length + dealerCards.length;
    if (holeCard) {
      ++cardsInPlay;
    }

    setCards([]);
    setDealerCards([]);
    setHoleCard(undefined);

    setDiscarded((curDiscarded: number): number => curDiscarded + cardsInPlay);
  }

  function shuffle() {
    clearTable();
    setDeck(newDeck(DECKS));
    setDiscarded(0);
  }

  return (
    <>
      <div id="discard-tray">
        <div
          id="discard-pile"
          style={{ height: `${(discarded / (DECKS * 52)) * 100}%` }}
        ></div>
      </div>

      <Hand id="dealer" cards={dealerCards} />
      <Hand id="player" cards={cards} />

      <div className="btn-container">
        <div className="btn-row"><button onClick={hit}>Hit</button></div>
        <div className="btn-row">
          <button onClick={clearTable}>Clear Table</button>
          <button onClick={shuffle}>Shuffle</button>
        </div>
      </div>
    </>
  );
}
