import { useState } from "react";

import Hand from "./Hand";
import "./App.css"

const DECKS = 6;

enum DealTo {
  player,
  dealer,
  hole,
}

export default function App() {
  const [deck, setDeck] = useState(newDeck(DECKS));
  const [discarded, setDiscarded] = useState(0);

  const [holeCard, setHoleCard] = useState<string>();
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);

  const [userTurn, setUserTurn] = useState(false);

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

    return deck;
  }

  function dealCard(dealTo: DealTo) {
    if (deck.length < 1) {
      alert("All cards have been drawn; shuffling.");
      shuffle();
      return;
    }

    // Rather than shuffling the cards when creating a new deck,
    // we draw from the deck using a random index. This prevents
    // cheating by peeking at the `deck` array in the debugger.
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    deck.splice(randomIndex, 1);
    setDeck([...deck]);

    switch (dealTo) {
     case DealTo.player:
      setHand((curHand: string[]): string[] => [...curHand, card]);
      break;
     case DealTo.dealer:
      setDealerHand((curHand: string[]): string[] => [...curHand, card]);
      break;
     case DealTo.hole:
      setHoleCard(card);
      break;
    }
  }

  function clearTable() {
    let cardsInPlay = hand.length + dealerHand.length;
    if (holeCard) {
      ++cardsInPlay;
    }

    setHand([]);
    setDealerHand([]);
    setHoleCard(undefined);

    setDiscarded((curDiscarded: number): number => curDiscarded + cardsInPlay);
  }

  function shuffle() {
    setDeck(newDeck(DECKS));
    newHand();
    // Dealing a new hand clears the table, but we still need to clear the
    // discard tray
    setDiscarded(0);
  }

  function newHand() {
    setUserTurn(true);
    clearTable();

    dealCard(DealTo.dealer);
    dealCard(DealTo.hole);
    dealCard(DealTo.player);
    dealCard(DealTo.player);

    // TODO: Check blackjack
  }

  function stand() {
    setUserTurn(false);
    setDealerHand((curHand: string[]): string[] => [...curHand, holeCard!]);
    setHoleCard(undefined);

    // TODO: Initiate dealer's turn
  }

  return (
    <>
      <div id="discard-tray">
        <div
          id="discard-pile"
          style={{ height: `${(discarded / (DECKS * 52)) * 100}%` }}
        ></div>
      </div>

      <Hand id="dealer" cards={dealerHand} />
      <Hand id="player" cards={hand} />

      <div className="btn-container">
        <div className="btn-row">
          <button onClick={() => dealCard(DealTo.player)} disabled={!userTurn}>Hit</button>
          <button onClick={stand} disabled={!userTurn}>Stand</button>
        </div>
        <div className="btn-row">
          <button onClick={newHand}>New Hand</button>
          <button onClick={shuffle}>Shuffle</button>
        </div>
      </div>
    </>
  );
}
