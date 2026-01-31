import User from "./user";

// write function to send message to specific user
export function sendMessage(user: User, msgData: any) {
  user.socket.send(
    JSON.stringify({
      type: msgData.type,
      message: msgData.message,
      data: msgData.data,
    }),
  );
}

// write function to send a message to a group of user
export function broadcast(users: Map<string, User>, msgData: any) {
  for (const value of users.values()) {
    sendMessage(value, msgData);
  }
}


