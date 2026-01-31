import { Page, BrowserContext, expect } from "@playwright/test";

export class GameHelper {
  constructor(private page: Page) {}

  /* ------------------ NAVIGATION ------------------ */

  async gotoHome() {
    await this.page.goto("/");
    await this.page.getByText("CREATE ROOM").waitFor();
  }

  /* ------------------ ROOM SETUP ------------------ */

  async createRoom(username: string): Promise<string> {
    await this.gotoHome();
    console.log(" host move to the landing page");
    await this.page.getByText("CREATE ROOM").click();
    console.log("Click to create-room button");
    await this.page.locator('input[name="Username"]').fill(username);
    console.log("enter the username by host : ", username);
    await this.page.getByTestId("create-room-btn").click();
    console.log("click to create-room button to create the final room");
    // wait for socket connection → lobby
    const gameIdEl = this.page.getByTestId("game-id");
    console.log("show the game id on a box : ", gameIdEl);
    await gameIdEl.waitFor({ state: "visible", timeout: 15_000 });
    console.log("wait for 15000 ms to get game id : ", gameIdEl);
    console.log(
      "final trimmed gameId : ",
      (await gameIdEl.textContent())!.trim(),
    );
    console.log("create-room test completed");
    return (await gameIdEl.textContent())!.trim();
  }

  async joinRoom(username: string, gameId: string) {
    await this.gotoHome();
    console.log("player move to lnading room.");
    await this.page.getByText("JOIN ROOM").click();
    console.log("click to join room button");
    await this.page.locator('input[name="Username"]').fill(username);
    console.log("enter the username by player : ", username);
    await this.page.locator('input[name="roomId"]').fill(gameId);
    console.log("enter the game id by player : ", gameId);
    await this.page.getByTestId("join-room-btn").click();
    console.log("click to join room button to enter the lobby");
    // wait until waiting screen is shown
    console.log("start to wait in lobby component");
    await this.page.getByText("WAITING FOR HOST").waitFor({
      timeout: 15_000,
    });
    console.log("join_room test completed");
  }

  async startGame() {
    console.log("start game test start");

    await this.page.getByTestId("start-button-btn").click();
    console.log("click to the start button by host to start the game");
    // wait for the actual board, not random svgs
    await this.page.getByTestId("game-board").waitFor({
      timeout: 20_000,
    });
    console.log("wait for a time to render svg board");
    console.log("start game test completed ");
  }

  /* ------------------ GAMEPLAY ------------------ */

  async waitForMyTurn() {
    console.log("[TEST] waitForMyTurn → waiting for active dice");

    const diceLocator = this.page.getByTestId("dice").filter({
      has: this.page.locator(".cursor-pointer"),
    });

    await diceLocator.waitFor({ timeout: 20_000 });

    console.log("[TEST] waitForMyTurn → active dice detected");
  }

  async rollDice() {
    console.log("[TEST] rollDice → locating dice");

    const dice = this.page.getByTestId("dice").first();

    console.log("[TEST] rollDice → waiting for dice to be clickable");

    await expect(dice).toHaveClass(/cursor-pointer/, {
      timeout: 20_000,
    });

    console.log("[TEST] rollDice → clicking dice");
    await dice.click();

    console.log("[TEST] rollDice → waiting for dice dots to appear");

    // wait until dice settles (dots visible)
    await this.page.locator(".bg-white").first().waitFor();

    const dots = await this.page.locator(".bg-white").count();
    console.log(`[TEST] rollDice → dice settled with ${dots} dots`);
  }

  async getDiceValue(): Promise<number> {
    const dots = await this.page.locator(".bg-white").count();
    console.log(`[TEST] getDiceValue → dice value (dot count): ${dots}`);
    return dots;
  }

//   async movePawn() {
//     console.log("[TEST] movePawn → locating clickable pawn");

//     const pawn = this.page.getByTestId("pawn").filter({
//       has: this.page.locator('[data-clickable="true"]'),
//     });

//     try {
//       console.log("[TEST] movePawn → waiting briefly for pawn (3s)");
//       await pawn.waitFor({ timeout: 3000 });

//       console.log("[TEST] movePawn → pawn is clickable, clicking");
//       await pawn.click();

//       console.log("[TEST] movePawn → waiting for animation");
//       await this.page.waitForTimeout(2000);

//       console.log("[TEST] movePawn → pawn move completed");
//     } catch {
//       console.log(
//         "[TEST] movePawn → no clickable pawn this turn (expected, skipping)",
//       );
//     }
//   }


 async waitForPawnMovement() {
  console.log("[TEST] Waiting for movementData from server");

  await this.page.waitForFunction(() => {
    const store = (window as any).__store;
    return store?.getState().movementData !== null;
  }, { timeout: 20_000 });

  console.log("[TEST] movementData received");
}


async tryMovePawn(): Promise<boolean> {
  console.log("[TEST] Looking for clickable pawn");

  const pawn = this.page
    .getByTestId("pawn")
    .filter({ has: this.page.locator('[data-clickable="true"]') })
    .first();

  if ((await pawn.count()) === 0) {
    console.log("[TEST] No clickable pawn this turn");
    return false;
  }

  await pawn.click();
  console.log("[TEST] Pawn clicked, make_move sent");

  return true;
}

// async waitForPawnToBeClickable(): Promise<boolean> {
//   console.log("[BOT] Waiting for pawn to become clickable");

//   try {
//     await this.page
//       .getByTestId("pawn")
//       .filter({ has: this.page.locator('[data-clickable="true"]') })
//       .first()
//       .waitFor({ timeout: 5_000 });

//     console.log("[BOT] Pawn is now clickable");
//     return true;
//   } catch {
//     console.log("[BOT] Pawn never became clickable this turn");
//     return false;
//   }
// }


}

/* ------------------ MULTIPLAYER SETUP ------------------ */

export async function setupMultiplayerGame(
  browser: any,
  playerNames: string[],
): Promise<{
  pages: Page[];
  contexts: BrowserContext[];
  gameId: string;
}> {
  const contexts: BrowserContext[] = [];
  const pages: Page[] = [];

  for (let i = 0; i < playerNames.length; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    contexts.push(context);
    pages.push(page);
  }

  const host = new GameHelper(pages[0]);
  const gameId = await host.createRoom(playerNames[0]);

  for (let i = 1; i < playerNames.length; i++) {
    const player = new GameHelper(pages[i]);
    await player.joinRoom(playerNames[i], gameId);
  }

  await host.startGame();

  return { pages, contexts, gameId };
}
