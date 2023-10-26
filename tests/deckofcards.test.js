const request = require("supertest")("https://www.deckofcardsapi.com/");
const expect = require("chai").expect;

describe("deck of cards", function () {
  let deckId;

  it("verify host is up", async function () {
    const response = await request.get("");

    expect(response.status).to.eql(200);
  });

  it("get a new deck > shuffle the deck > draw from deck > check if anyone has blackjack", async function () {
    //Get a new deck
    const responseGetNewDeck = await request.get("/api/deck/new/");

    expect(responseGetNewDeck.status).to.eql(200);
    deckId = responseGetNewDeck.body.deck_id;
    console.log("New Deck_Id :", deckId);

    // Shuffle the deck
    const responseShuffleGivenDeck = await request.get(
      `/api/deck/${deckId}/shuffle/`
    );
    expect(responseShuffleGivenDeck.status).to.eql(200);

    // Draw from deck
    let playerCount = 2;
    let drawCount = 3;
    let playerCards = [];

    for (let i = 0; i < playerCount; i++) {
      for (let j = 0; j < drawCount; j++) {
        let responseDrawDeck = await request.get(
          `/api/deck/${deckId}/draw/?count=1`
        );
        playerCards[i] =
          playerCards[i] !== undefined
            ? playerCards[i] + responseDrawDeck.body.cards[0].value + "|"
            : responseDrawDeck.body.cards[0].value + "|";
      }
      console.log(
        `Cards in hand of Player#${i + 1}: `,
        playerCards[i].toLocaleString()
      );

      // Check for blackjack
      if (
        playerCards[i].includes("ACE") &&
        (playerCards[i].includes("JACK") ||
          playerCards[i].includes("KING") ||
          playerCards[i].includes("QUEEN") ||
          playerCards[i].includes("10"))
      ) {
        console.log(`Player: ${i + 1} has blackjack 😀`);
      }
    }
  });
});
