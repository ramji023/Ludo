import { test, expect } from "@playwright/test";
import { setupMultiplayerGame, GameHelper } from "./helpers/game-setup";

test.describe("Ludo Game - Complete Flow", () => {
  test("2 players can create and join game", async ({ browser }) => {
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    // All players should see the game board
    for (const page of pages) {
      await expect(page.getByTestId("game-board")).toBeVisible();
      await expect(page.getByTestId("dice").first()).toBeVisible();
    }

    // Cleanup
    await Promise.all(contexts.map((c) => c.close()));
    console.log("First test has been completed properly");
  });

  test("Active player can roll dice and move pawn", async ({ browser }) => {
    console.log(
      "\n[TEST] ===== Active player can roll dice and move pawn =====",
    );

    console.log("[TEST] Setting up multiplayer game (2 players)");
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    console.log("[TEST] Creating GameHelper instances");
    const helpers = pages.map((p, index) => {
      console.log(`[TEST] Helper created for player index ${index}`);
      return new GameHelper(p);
    });

    // Find active player (dice is clickable)
    console.log("[TEST] Detecting active player (clickable dice)");
    let activeIndex = -1;

    for (let i = 0; i < pages.length; i++) {
      console.log(`[TEST] Checking dice state for player ${i}`);
      const dice = pages[i].getByTestId("dice").first();

      const isClickable = await dice.evaluate((el) =>
        el.classList.contains("cursor-pointer"),
      );

      console.log(`[TEST] Player ${i} dice clickable: ${isClickable}`);

      if (isClickable) {
        activeIndex = i;
        console.log(`[TEST] Active player found at index ${i}`);
        break;
      }
    }

    expect(activeIndex).toBeGreaterThanOrEqual(0);
    console.log(`[TEST] Confirmed active player index: ${activeIndex}`);

    // Roll dice
    console.log("[TEST] Rolling dice for active player");
    await helpers[activeIndex].rollDice();

    console.log("[TEST] Fetching dice value");
    const diceValue = await helpers[activeIndex].getDiceValue();

    console.log(`[TEST] Dice value received: ${diceValue}`);
    expect(diceValue).toBeGreaterThan(0);
    expect(diceValue).toBeLessThanOrEqual(7);

    // Move pawn
    console.log("[TEST] Moving pawn for active player");

    const moved = await helpers[activeIndex].tryMovePawn();

    if (!moved) {
      console.log("[TEST] No pawn move this turn — skipping");
    }

    console.log("[TEST] Pawn move completed");

    // Cleanup
    console.log("[TEST] Cleaning up browser contexts");
    await Promise.all(contexts.map((c) => c.close()));

    console.log("[TEST] ===== Test completed successfully =====\n");
  });

  test("Only one player can roll dice at a time", async ({ browser }) => {
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    let activeCount = 0;

    for (const page of pages) {
      const dice = page.getByTestId("dice").first();
      const isActive = await dice.evaluate((el) =>
        el.classList.contains("cursor-pointer"),
      );
      if (isActive) activeCount++;
    }

    expect(activeCount).toBe(1);

    // Cleanup
    await Promise.all(contexts.map((c) => c.close()));
  });

  test("Player cannot roll dice twice in one turn", async ({ browser }) => {
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    const helpers = pages.map((p) => new GameHelper(p));

    let activeIndex = -1;
    for (let i = 0; i < pages.length; i++) {
      const dice = pages[i].getByTestId("dice").first();
      if (
        await dice.evaluate((el) => el.classList.contains("cursor-pointer"))
      ) {
        activeIndex = i;
        break;
      }
    }

    const activePage = pages[activeIndex];

    // Roll once
    await helpers[activeIndex].rollDice();

    // Dice should now be disabled
    const isStillActive = await activePage
      .getByTestId("dice")
      .first()
      .evaluate((el) => el.classList.contains("cursor-pointer"));

    expect(isStillActive).toBe(false);

    // Cleanup
    await Promise.all(contexts.map((c) => c.close()));
  });

  test("Pawn movement happens when server sends movementData", async ({
    browser,
  }) => {
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    const helpers = pages.map((p) => new GameHelper(p));

    // find active player (dice clickable)
    let activeIndex = -1;
    for (let i = 0; i < pages.length; i++) {
      const dice = pages[i].getByTestId("dice").first();
      if (
        await dice.evaluate((el) => el.classList.contains("cursor-pointer"))
      ) {
        activeIndex = i;
        break;
      }
    }

    expect(activeIndex).toBeGreaterThanOrEqual(0);

    // roll dice
    await helpers[activeIndex].rollDice();

    // try to move pawn
    const moved = await helpers[activeIndex].tryMovePawn();
    if (!moved) {
      console.log("[TEST] No pawn move this turn, skipping");
      return;
    }

    await helpers[activeIndex].waitForPawnMovement();

    console.log("[TEST] Pawn movement confirmed via Zustand");

    await Promise.all(contexts.map((c) => c.close()));
  });

  test("Game state is synchronized across all players", async ({ browser }) => {
    const { pages, contexts } = await setupMultiplayerGame(browser, [
      "Alice",
      "Bob",
    ]);

    const helpers = pages.map((p) => new GameHelper(p));

    // Find active player
    let activeIndex = -1;
    for (let i = 0; i < pages.length; i++) {
      const dice = pages[i].getByTestId("dice").first();
      if (
        await dice.evaluate((el) => el.classList.contains("cursor-pointer"))
      ) {
        activeIndex = i;
        break;
      }
    }

    expect(activeIndex).toBeGreaterThanOrEqual(0);

    // Active player rolls dice
    await helpers[activeIndex].rollDice();

    // Try to move pawn (may or may not happen)
    await helpers[activeIndex].tryMovePawn();

    // Give server a moment to broadcast state
    await pages[0].waitForTimeout(1000);

    let activeCount = 0;

    for (const page of pages) {
      const dice = page.getByTestId("dice").first();
      const isActive = await dice.evaluate((el) =>
        el.classList.contains("cursor-pointer"),
      );
      if (isActive) activeCount++;
    }

    expect(activeCount).toBeLessThanOrEqual(1);

    // Cleanup
    await Promise.all(contexts.map((c) => c.close()));
  });
});

// pnpm playwright test -g "Bot can play the game continuously" --ui
test("Bot plays turns automatically", async ({ browser }) => {
  const { pages, contexts } = await setupMultiplayerGame(browser, [
    "Alice",
    "Bob",
  ]);

  const helpers = pages.map((p) => new GameHelper(p));

  const MAX_TURNS = 10;
  let turnsPlayed = 0;

  while (turnsPlayed < MAX_TURNS) {
    for (let i = 0; i < pages.length; i++) {
      const dice = pages[i].getByTestId("dice").first();

      const isMyTurn = await dice
        .locator(":scope")
        .filter({ hasText: "" })
        .evaluate((el) => el.classList.contains("cursor-pointer"))
        .catch(() => false);

      if (!isMyTurn) continue;

      console.log(`[BOT] Player ${i} rolling dice`);
      await dice.click();

      // wait until dice stops spinning
      await expect(dice).not.toHaveClass(/animate-spin/, {
        timeout: 10_000,
      });

      console.log(`[BOT] Dice settled`);

      // try pawn once
      const moved = await helpers[i].tryMovePawn();

      if (moved) {
        console.log(`[BOT] Player ${i} moved pawn`);
        await helpers[i].waitForPawnMovement();
      } else {
        console.log(`[BOT] Player ${i} had no valid pawn`);
      }

      turnsPlayed++;
      console.log(`[BOT] Turns played: ${turnsPlayed}`);
    }
  }

  await Promise.all(contexts.map((c) => c.close()));
});
