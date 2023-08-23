interface Score {
  value: number,
  type: ScoreType,
}

enum ScoreType {
  hard,
  soft,
}

export default function score(hand: string[]): Score {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    const value = card[0];
    if (value === "A") {
      score += 11;
      ++aces;
    } else if ("XJQK".includes(value)) {
      score += 10;
    } else {
      score += parseInt(value);
    }
  }

  while (score > 21 && aces) {
    score -= 10;
    --aces;
  }

  return {
    value: score,
    type: aces ? ScoreType.soft : ScoreType.hard,
  }
}
