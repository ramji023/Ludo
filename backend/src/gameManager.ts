import { broadcast, sendMessage } from "./broadcaster";
import {
  ALL_PLAYERS,
  CREATE_ROOM,
  DICE_ROLLED,
  GAME_END,
  GAME_STARTED,
  GAME_WON,
  MADE_MOVE,
  PAWN_KILLED,
  PLAYER_JOINED,
  SEND_CHAT_MESSAGE,
  TURN_UPDATED,
  UPDATE_PLAYERS,
} from "./events";
import Game from "./game";
import User from "./user";
import { WebSocket } from "ws";
import {
  createMovementPath,
  createMovementPathForVictory,
  findStart,
  isInHome,
  isInMainPath,
  isInVictoryPath,
} from "./utils/helperFn";
import { pawnPosition, victoryPathMap } from "./utils/pawnPath";

export class GameManager {
  private User: Map<string, User>;
  private Game: Map<string, Game>;

  constructor() {
    this.User = new Map();
    this.Game = new Map();
  }

  // handle to adding host
  addHost(username: string, socket: WebSocket) {
    console.log("Hit add host end point");
    const user = new User(username, "host", socket); // initialize a new user as a host
    // if user successfully created then initialize a new game
    if (user) {
      const game = new Game(user); // then initialize a new game with "create" status

      // assign the color to player
      user.color = game.colors[0]; // assign first color
      // then remove that first color from game.colors
      game.colors.splice(0, 1);
      // store user and game in single record
      this.User.set(user.id, user);
      this.Game.set(game.gameId, game);

      // send the message to that host about successfully create game and user
      const msgData = {
        type: CREATE_ROOM,
        message: "room has been created successfully",
        data: {
          username: user.username,
          id: user.id,
          type: user.type,
          color: user.color,
          gameId: game.gameId,
          Gametatus: game.status,
          players: game.playerData(),
        },
      };
      sendMessage(user, msgData);
    }
  }

  // handle to adding user
  addUser(username: string, game: Game, socket: WebSocket) {
    const user = new User(username, "player", socket); // initialize a new user as a player
    // if user successfully created then add user in an existing game
    if (user) {
      // assign the color to player
      user.color = game.colors[0]; // assign first color
      // then remove that first color from game.colors
      game.colors.splice(0, 1);
      // store user in single record
      this.User.set(user.id, user);
      // add this user in game object
      game.addPlayer(user);

      // send the message to that host about successfully added in game
      const msgData = {
        type: PLAYER_JOINED,
        message: "player has been added in game successfully",
        data: {
          username: user.username,
          id: user.id,
          type: user.type,
          color: user.color,
          gameId: game.gameId,
          Gametatus: game.status,
          players: game.playerData(),
        },
      };
      sendMessage(user, msgData);

      // and then broadcast message to every player to tell that a player has joined the game
      const msg = {
        type: ALL_PLAYERS,
        message: "all players data",
        data: {
          players: game.playerData(),
        },
      };
      broadcast(game.players, msg);
    }
  }

  //  function to handle all messages events
  handleMessages(socket: WebSocket, data: string) {
    try {
      const parsedMessageObject = JSON.parse(data);

      // first check that user is valid and gameId is valid
      const user = this.User.get(parsedMessageObject.data.id);
      const game = this.Game.get(parsedMessageObject.data.gameId);

      if (user && game) {
        switch (parsedMessageObject.type) {
          // if client send message event to server
          case "start_game":
            // then start the game
            if (user.type === "host") {
              game.startGame();
              //  after start the game send players data and currentplayer turn and Gametatus to all the players
              const msg = {
                type: GAME_STARTED,
                message: "Game has been started",
                data: {
                  players: game.playerData(),
                  currentPlayerTurn:
                    game.currentPlayerTurn[game.currentTurnIndex],
                  gameStatus: game.status,
                },
              };
              broadcast(game.players, msg);
            }
            break;

          case "roll_dice":
            // first check that current user turn match with given user id
            if (user.id === game.currentPlayerTurn[game.currentTurnIndex]) {
              // if it is matched then calculate dice value
              const value = Math.floor(Math.random() * 6) + 1;
              game.currentDiceValue = value; // set the dice value
              // game.currentDiceValue = user.color === "blue" ? 56 : 58;

              // now broadcast the active dice value to all players
              const msg = {
                type: DICE_ROLLED,
                message: "dice value has been calculated",
                data: {
                  diceValue: game.currentDiceValue,
                },
              };
              broadcast(game.players, msg);
            }
            break;

          case "make_move":
            // first check that current user turn match with given user id
            if (user.id === game.currentPlayerTurn[game.currentTurnIndex]) {
              // if it matched then calculate steps and new position of that pawn
              // and update the pawn position of that player
              const playerColor: string = user.color as string; // store player color
              const pawnId: string = parsedMessageObject.data.pawnId; // store pawnId
              // and then store pawn position
              const currentPawnPositon: {
                x: number;
                y: number;
                index: number;
              } = parsedMessageObject.data.position;

              // <---------------------------------------------- first check that pawn is in home or not   --------------------------------------------------->
              // now first check if pawn in homeBase or not
              const result = isInHome(playerColor, pawnId, currentPawnPositon);
              console.log("pawn is in home or not : ", result);
              // if pawn is in home then move to that pawn to start position
              if (result) {
                // pawn is in start position - check if dice rolled a 6
                if (game.currentDiceValue !== 6) {
                  // dice wasn't 6, so move to next player without sending movement
                  game.currentTurnIndex =
                    (game.currentTurnIndex + 1) % game.currentPlayerTurn.length;
                  game.currentDiceValue = -1;

                  const msgData = {
                    type: UPDATE_PLAYERS,
                    message: "dice not 6, moving to next player",
                    data: {
                      players: game.playerData(),
                      currentPlayerTurn:
                        game.currentPlayerTurn[game.currentTurnIndex],
                      Gametatus: game.status,
                    },
                  };
                  broadcast(game.players, msgData);
                  return; // Important: exit here
                }
                // code here
                const newPosition = findStart(playerColor, pawnId); // find the start position of a perticular player
                // if newPosition is valid then send updated value to client

                // first store fromPosition and toPosition
                game.fromPosition = {
                  x: parsedMessageObject.data.position.x,
                  y: parsedMessageObject.data.position.y,
                  index: parsedMessageObject.data.position.index,
                  playerId: user.id,
                  pawnId: parsedMessageObject.data.pawnId,
                  color: user.color as string,
                };
                game.toPosition = {
                  x: newPosition.x as number,
                  y: newPosition.y as number,
                  index: newPosition.index as number,
                  playerId: user.id,
                  pawnId: parsedMessageObject.data.pawnId,
                  color: user.color as string,
                };
                if (newPosition) {
                  const msgData = {
                    type: MADE_MOVE,
                    message:
                      "pawn movement from home --- > start send successfully",
                    data: {
                      playerId: user.id,
                      gameId: game.gameId,
                      pawnId: pawnId,
                      movement: [currentPawnPositon, newPosition],
                    },
                  };
                  broadcast(game.players, msgData);
                  return;
                }
              }

              // <-------------------------------------------    if pawn is not in home then  ---------------------------->
              const pos = isInMainPath(playerColor, pawnId, currentPawnPositon);
              console.log("this pawn is in main path : ", pos);
              // if pawn is in main path
              if (
                typeof pos === "number" &&
                pos !== -1 &&
                pos !== null &&
                pos !== undefined
              ) {
                // first store all the movements in an array
                const movementsPath = createMovementPath(
                  pos,
                  game.currentDiceValue,
                  playerColor,
                );
                console.log(
                  "movement path if pawn is in main path : ",
                  movementsPath,
                );
                if (movementsPath) {
                  // now store it in fromPosition(start point) and toPosition(end point) in in-memory
                  game.toPosition = {
                    x: movementsPath[movementsPath.length - 1].x,
                    y: movementsPath[movementsPath.length - 1].y,
                    index: movementsPath[movementsPath.length - 1].index,
                    playerId: user.id,
                    pawnId: parsedMessageObject.data.pawnId,
                    color: user.color as string,
                  };
                  game.fromPosition = {
                    x: parsedMessageObject.data.position.x,
                    y: parsedMessageObject.data.position.y,
                    index: parsedMessageObject.data.position.index,
                    playerId: user.id,
                    pawnId: parsedMessageObject.data.pawnId,
                    color: user.color as string,
                  };

                  // and then broadcast the message to all players

                  const msgData = {
                    type: MADE_MOVE,
                    message:
                      "pawn movement data from mainPath ----> mainPath send successfully",
                    data: {
                      playerId: user.id,
                      gameId: game.gameId,
                      pawnId: pawnId,
                      movement: movementsPath,
                    },
                  };
                  broadcast(game.players, msgData);
                  return;
                }
              }

              // <---------------------------------  check if pawn is in the victory path  ------------------------>
              const victoryPos = isInVictoryPath(
                playerColor,
                currentPawnPositon,
              );

              if (victoryPos !== -1 && victoryPos != null) {
                const path = victoryPathMap[playerColor];
                const lastIndex = path.length - 1;
                const remainingSteps = lastIndex - victoryPos;

                // not eligible for dice shoots
                if (game.currentDiceValue > remainingSteps + 1) {
                  broadcast(game.players, {
                    type: UPDATE_PLAYERS,
                    message: "Pawn not eligible to move on victory path",
                    data: {
                      players: game.playerData(),
                      currentPlayerTurn:
                        game.currentPlayerTurn[game.currentTurnIndex],
                      Gametatus: game.status,
                    },
                  });
                  return;
                }

                const movementsPath = createMovementPathForVictory(
                  victoryPos,
                  game.currentDiceValue,
                  playerColor,
                );

                if (!movementsPath) return;

                game.toPosition = {
                  ...movementsPath[movementsPath.length - 1],
                  playerId: user.id,
                  pawnId: parsedMessageObject.data.pawnId,
                  color: user.color as string,
                };

                game.fromPosition = {
                  ...parsedMessageObject.data.position,
                  playerId: user.id,
                  pawnId: parsedMessageObject.data.pawnId,
                  color: user.color as string,
                };

                broadcast(game.players, {
                  type: MADE_MOVE,
                  message: "pawn moved on victory path",
                  data: {
                    playerId: user.id,
                    gameId: game.gameId,
                    pawnId,
                    movement: movementsPath,
                  },
                });

                return;
              }
            }
            break;

          case "passed-turn":
            if (user.id === game.currentPlayerTurn[game.currentTurnIndex]) {
              console.log("hit this event");
              //now update the currentPlayerTurn
              game.currentTurnIndex =
                (game.currentTurnIndex + 1) % game.currentPlayerTurn.length;
              game.currentDiceValue = -1;
              const msgData = {
                type: TURN_UPDATED,
                data: {
                  currentPlayerTurn:
                    game.currentPlayerTurn[game.currentTurnIndex],
                },
              };
              broadcast(game.players, msgData);
            }

            break;

          case "movement_done":
            // first check user is correct or not
            if (
              user.id === game.fromPosition?.playerId &&
              user.id === game.currentPlayerTurn[game.currentTurnIndex] &&
              game.toPosition
            ) {
              // if correct then first update the position of that player
              game.updatePawnPosition(user.id); // just update the pawn position

              //before updating the current player turn first we have to check is there is kill situation
              const killResult = game.isThereKill(game.toPosition);
              // if there is kill situation then
              if (killResult) {
                console.log("there is kill situtation : ", killResult);
                const { killedPlayer, killedPawn } = killResult;
                // call method to set fromPosition and toPosition
                const momentPath = game.sendPawnToHome(
                  killedPlayer,
                  killedPawn,
                );
                // and then broadcast the message to all players
                console.log("movement path after kill : ", momentPath);

                const killMsg = {
                  type: PAWN_KILLED, // New event type
                  message: "pawn killed - sending to home",
                  data: {
                    playerId: killedPlayer.id,
                    gameId: game.gameId,
                    pawnId: killedPawn.pawnId,
                    movement: momentPath,
                  },
                };
                broadcast(game.players, killMsg);

                //  <--------------------------------      if that user got won       ------------------------------------>
                const hasWon = game.checkVictory(user.id);

                if (hasWon) {
                  user.hasWon = true; // mark that player hasWon :true
                  //then remove that player id from that currentPlayerTurn
                  game.currentPlayerTurn = game.currentPlayerTurn.filter(
                    (player) => player !== user.id,
                  );
                  // also add that player with rank in winnerRank array
                  game.winnerRank.push({
                    playerId: user.id,
                    rank: game.winnerRank.length + 1,
                  });
                  // send game won event
                  const msg = {
                    type: GAME_WON,
                    message: `Player ${user.color} has won!`,
                    data: {
                      players: game.playerData(),
                      winnerRank: game.winnerRank,
                    },
                  };
                  broadcast(game.players, msg);

                  // check if game should end or not
                  if (game.currentPlayerTurn.length === 1) {
                    game.status = "end";
                    const msg = {
                      type: GAME_END,
                      message: `Game has been ended`,
                      data: {
                        players: game.playerData(),
                        gameStatus: game.status,
                        winnerRank: game.winnerRank,
                      },
                    };
                    broadcast(game.players, msg);
                  }
                  // first delete all players
                  game.players.forEach((player) => {
                    this.User.delete(player.id);
                  });
                  // just delete that game data
                  this.Game.delete(game.gameId);
                  return;
                }
              } else {
                if (game.currentDiceValue === 6) {
                  const msgData = {
                    type: UPDATE_PLAYERS,
                    message: "updated players data and current turn",
                    data: {
                      players: game.playerData(),
                      currentPlayerTurn:
                        game.currentPlayerTurn[game.currentTurnIndex],
                      Gametatus: game.status,
                    },
                  };
                  broadcast(game.players, msgData);
                  // make -1 to currentDiceValue
                  game.currentDiceValue = -1;
                } else {
                  //now update the currentPlayerTurn
                  game.currentTurnIndex =
                    (game.currentTurnIndex + 1) % game.currentPlayerTurn.length;
                  // now send next player turn and updated players to client
                  const msgData = {
                    type: UPDATE_PLAYERS,
                    message: "here is the updated players data",
                    data: {
                      players: game.playerData(),
                      currentPlayerTurn:
                        game.currentPlayerTurn[game.currentTurnIndex],
                      Gametatus: game.status,
                    },
                  };
                  broadcast(game.players, msgData);
                  game.currentDiceValue = -1;
                }
              }
            }
            break;

          case "kill_animation_done":
            // first update the pawn position of killed pawn
            game.updatePawnPosition(parsedMessageObject.data.id);
            console.log("user id in animation done event : ", user.id);
            console.log(
              "current player turn : ",
              game.currentPlayerTurn[game.currentTurnIndex],
            );
            // Client sends this after kill animation finishes
            if (
              parsedMessageObject.data.killedId === game.toPosition?.playerId &&
              user.id === game.currentPlayerTurn[game.currentTurnIndex]
            ) {
              if (game.currentDiceValue === 6) {
                this.sendTurnUpdate(game);
                //reset dice value but keep same player turn
                game.currentDiceValue = -1;
              } else {
                this.advancePlayerTurn(game);
                this.sendTurnUpdate(game);
                game.currentDiceValue = -1;
              }
              // game.currentDiceValue = -1;

              // const msgData = {
              //   type: UPDATE_PLAYERS,
              //   message: "here is the updated players data after kill",
              //   data: {
              //     players: game.playerData(),
              //     currentPlayerTurn:
              //       game.currentPlayerTurn[game.currentTurnIndex],
              //     Gametatus: game.status,
              //   },
              // };
              // broadcast(game.players, msgData);
            }
            break;

          case "send_chat_message":
            if (game.status === "start") {
              const messageData = game.addMessage(
                user.id,
                user.username,
                parsedMessageObject.data.message,
                user.color as string,
              );

              const msg = {
                type: SEND_CHAT_MESSAGE,
                messgae: "send all the message successfully",
                data: {
                  messages: messageData,
                },
              };
              // broadcast the message to every user
              broadcast(game.players, msg);
            }
            break;
        }
      }
    } catch (err) {
      console.log(data);
      console.log(err);
    }
  }

  // function to check wheather gameId is valid or not
  validGameId(gameId: string) {
    return this.Game.get(gameId);
  }

  // Helper method to advance to next player turn
  private advancePlayerTurn(game: Game): void {
    game.currentTurnIndex =
      (game.currentTurnIndex + 1) % game.currentPlayerTurn.length;
    game.currentDiceValue = -1;
  }

  // Helper method to send turn update to all players
  private sendTurnUpdate(game: Game): void {
    const msgData = {
      type: UPDATE_PLAYERS,
      message: "updated players data and current turn",
      data: {
        players: game.playerData(),
        currentPlayerTurn: game.currentPlayerTurn[game.currentTurnIndex],
        Gametatus: game.status,
      },
    };
    broadcast(game.players, msgData);
  }

  // write function to remove that player data
  handleRemove(ws: WebSocket) {
    // find the user by searching the whole this.User
    let disconnectedUserId: string | null = null;

    for (const [username, user] of this.User.entries()) {
      if (user.socket === ws) {
        console.log(`User ${username} disconnected`);
        disconnectedUserId = user.id;
        break;
      }
    }

    if (!disconnectedUserId) {
      console.log("User not found");
      return;
    }

    // Find which game they were in (if any)
    let userGame: Game | null = null;
    for (const [gameId, game] of this.Game.entries()) {
      if (game.hasPlayer(disconnectedUserId)) {
        // Assuming you have this method
        userGame = game;
        break;
      }
    }

    if (userGame) {
      // Remove user from game
      userGame.removePlayer(disconnectedUserId);
      console.log(`Removed ${disconnectedUserId} from game ${userGame.gameId}`);
    }

    // Remove from User map
    this.User.delete(disconnectedUserId);
  }
}
