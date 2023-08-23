import { ReactNode } from "react";

import { publicUrl } from "./util";

interface HandProps {
  id: string,
  cards: string[],
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

export default function Hand({ id, cards }: HandProps) {
  return (
    <div id={id} className="cards">
      {cards.map((card: string, i: number): ReactNode => {
        return (
          <img
            className="card"
            src={publicUrl(`cards/${card}.png`)}
            alt={cardAltText(card)}
            key={i}
          />
        );
      })}
    </div>
  );
}
