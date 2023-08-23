import { ReactNode, useState } from "react";
import "./App.css"

const DECKS = 6;

export default function App() {
  // @ts-ignore unused declaration
  const [deck, setDeck] = useState(newDeck(DECKS));

  // @ts-ignore unused declaration
  const [cardsInPlay, setCardsInPlay] = useState(0);
  const [discarded, setDiscarded] = useState(0);

  // @ts-ignore unused declaration
  const [dealerCards, setDealerCards] = useState([]);
  // @ts-ignore unused declaration
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

  function cardAltText(card: string): string {
    const ranks: { [key: string]: string } = {
      X: "10",
      J: "Jack",
      Q: "Queen",
      K: "King",
    }

    const suits: { [key: string]: string } = {
      S: "Spades",
      D: "Diamonds",
      C: "Clubs",
      H: "Hearts",
    }

    return `${ranks[card[0]] || card[0]} of ${suits[card[1]]}`;
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

  function discard(numCards: number) {
    setDiscarded((curDiscarded: number): number => curDiscarded + numCards);
  }

  return (
    <>
      <div id="dealer" className="cards">
        {dealerCards.map((card: string, i: number): ReactNode => {
          return (
            <img
              className="card"
              src={`/cards/${card}.png`}
              alt={cardAltText(card)}
              key={i}
            />
          );
        })}
      </div>

      <div id="discard-tray">
        <div
          id="discard-pile"
          style={{ height: `${(discarded / (DECKS * 52)) * 100}%` }}
        ></div>
      </div>

      <div id="player" className="cards">
        {cards.map((card: string, i: number): ReactNode => {
          return (
            <img
              className="card"
              src={`/cards/${card}.png`}
              alt={cardAltText(card)}
              key={i}
            />
          );
        })}
      </div>

      <button onClick={hit}>Hit</button>
      <button onClick={() => discard(1)}>Discard</button>
    </>
  );
}
