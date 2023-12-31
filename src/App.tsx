import { useState } from "react";

import Hand from "./Hand";
import "./App.css"
import score from "./score";

const DECKS = 6;

enum DealTo {
  player,
  dealer,
  hole,
}

enum Message {
  none = "",
  bust = "Bust!",
  playerWin = "You win!",
  dealerWin = "Dealer wins!",
  push = "Push.",
  blackjack = "Blackjack!",
}

export default function App() {
  const [deck, setDeck] = useState(newDeck(DECKS));
  const [discarded, setDiscarded] = useState(0);

  let [holeCard, setHoleCard] = useState<string>("");
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);

  const [playerTurn, setPlayerTurn] = useState(false);
  const [message, setMessage] = useState(Message.none);

  function newDeck(decks: number): string[] {
    const deck = [...Array(decks)].flatMap(_ => {
      return [..."SDCH"].flatMap(suit => {
        return [..."23456789XJQKA"].map(rank => rank + suit);
      });
    });

    // Shuffle using the Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  function dealCard(dealTo: DealTo): boolean {
    if (deck.length < 1) {
      alert("All cards have been drawn; shuffling.");
      shuffle();
      return false;
    }

    const card = deck.splice(0, 1)[0];
    setDeck([...deck]);

    switch (dealTo) {
     case DealTo.player:
      hand.push(card);
      setHand(hand);
      break;
     case DealTo.dealer:
      dealerHand.push(card);
      setDealerHand(dealerHand);
      break;
     case DealTo.hole:
      holeCard = card;
      setHoleCard(holeCard);
      break;
    }

    return true;
  }

  function clearTable() {
    let cardsInPlay = hand.length + dealerHand.length;
    if (holeCard) {
      ++cardsInPlay;
    }

    hand.splice(0, hand.length);
    setHand(hand);
    dealerHand.splice(0, dealerHand.length);
    setDealerHand(dealerHand);
    setHoleCard("");

    setDiscarded((curDiscarded: number): number => curDiscarded + cardsInPlay);
  }

  function shuffle() {
    deck.splice(0, deck.length, ...newDeck(DECKS));
    setDeck(deck);
    newHand();
    // Dealing a new hand clears the table, but we still need to clear the
    // discard tray
    setDiscarded(0);
  }

  function newHand() {
    setMessage(Message.none);
    setPlayerTurn(true);
    clearTable();

    dealCard(DealTo.dealer) &&
      dealCard(DealTo.hole) &&
      dealCard(DealTo.player) &&
      dealCard(DealTo.player);

    if (score(hand).value == 21) {
      // Player blackjack
      revealHoleCard();
      if (score(dealerHand).value == 21) {
        setMessage(Message.push);
      } else {
        setMessage(Message.blackjack);
      }

      setPlayerTurn(false);
    } else if (score([...dealerHand, holeCard]).value == 21) {
      // Dealer blackjack
      revealHoleCard();
      setMessage(Message.dealerWin);
      setPlayerTurn(false);
    }
  }

  function hit() {
    dealCard(DealTo.player);

    const s = score(hand);

    if (s.value == 21) {
      playDealerTurn();
    } else if (s.value > 21) {
      setMessage(Message.bust);
      setPlayerTurn(false);
    }
  }

  function revealHoleCard() {
    dealerHand.push(holeCard);
    setDealerHand(dealerHand);
    setHoleCard("");
  }

  function playDealerTurn() {
    setPlayerTurn(false);
    revealHoleCard();

    let s = score(dealerHand);
    for (; s.value <= 17; s = score(dealerHand)) {
      dealCard(DealTo.dealer);
    }

    const dealerScore = s.value;
    const playerScore = score(hand).value;
    if (playerScore > dealerScore || dealerScore > 21) {
      setMessage(Message.playerWin);
    } else if (dealerScore > playerScore) {
      setMessage(Message.dealerWin);
    } else {
      setMessage(Message.push);
    }
  }

  const stand = playDealerTurn;

  return (
    <>
      <Hand id="dealer" cards={dealerHand} />

      <div id="discard-tray">
        <div
          id="discard-pile"
          style={{ height: `${(discarded / (DECKS * 52)) * 100}%` }}
        ></div>
      </div>

      <div id="message">{message}</div>
      <Hand id="player" cards={hand} />

      <div className="btn-container">
        <div className="btn-row">
          <button onClick={hit} disabled={!playerTurn}>Hit</button>
          <button onClick={stand} disabled={!playerTurn}>Stand</button>
          <button disabled>Double</button>
          <button disabled>Split</button>
        </div>
        <div className="btn-row">
          <button onClick={newHand}>New Hand</button>
          <button onClick={shuffle}>Shuffle</button>
        </div>
      </div>
    </>
  );
}
