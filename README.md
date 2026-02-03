# Ludo Game - Multiplayer Real-Time Game

A modern, real-time multiplayer Ludo game built with React, Zustand, and WebSocket technology. Play with up to 4 players simultaneously and communicate via in-game chat!

![Ludo Game Banner](https://res.cloudinary.com/dqr7qcgch/image/upload/v1770120479/4_fyi2ku.jpg)

## 🎮 Features

- **Real-Time Multiplayer**: Play with up to 4 players in real-time using WebSocket connections
- **Live Chat**: Communicate with other players during the game
- **State Management**: Efficient state handling with Zustand
- **Responsive Design**: Works seamlessly across different screen sizes
- **Classic Ludo Rules**: Traditional Ludo gameplay with all standard rules implemented
- **Player Authentication**: Join rooms with unique player identities
- **Game Lobby**: Wait for other players to join before starting

## 🖼️ Screenshots

### Game Board
![Game Board](https://res.cloudinary.com/dqr7qcgch/image/upload/v1770120479/4_fyi2ku.jpg)

### Create Game
![New Game](https://res.cloudinary.com/dqr7qcgch/image/upload/v1770120448/2_vmoykz.jpg)

### Player Lobby
![Player Lobby](https://res.cloudinary.com/dqr7qcgch/image/upload/v1770120448/3_tjr6fn.jpg)

### Register Page
![Register Page](https://res.cloudinary.com/dqr7qcgch/image/upload/v1770120461/1_oh0we7.jpg)

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building the game interface
- **Zustand** - Lightweight state management
- **WebSocket** - Real-time bidirectional communication
- **Tailwind CSS** - Styling and animations

### Backend
- **Node.js** - Server runtime
- **Express** - Web framework
- **WebSocket** - Real-time communication protocol

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- pnpm package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   https://github.com/ramji023/Ludo.git
   cd Ludo
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   pnpm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   pnpm start
   ```
   The server will run on `ws://localhost:8080`

2. **Start the Frontend**
   ```bash
   cd ../frontend
   pnpm start
   ```
   The application will open in your browser at `http://localhost:5173`

## 🎯 How to Play

1. **Join a Game**
   - Enter your player name
   - Join or create a game room
   - Wait for other players to join (minimum 2 players, maximum 4)

2. **Game Rules**
   - Roll the dice to move your tokens
   - Get a 6 to bring a token out of home
   - Move all 4 tokens to the victory zone to win
   - Capture opponent tokens by landing on their position
   - Roll a 6 to get an extra turn

3. **Chat with Players**
   - Use the chat interface to communicate with other players
   - Send messages in real-time during gameplay

## 📁 Project Structure

```
ludo-game/
├── frontend/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand store
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.js         # Main App component
│   └── package.json
│
├── backend/                # Backend WebSocket server
│   ├── index.js          # Server entry point
│   ├── gameLogic.js      # Game logic and rules
│   ├── socketHandlers.js # WebSocket event handlers
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_SOCKET_URL=ws://localhost:8080
```

## 🌐 WebSocket Events

### Client → Server
- `join-room` - Join a game room
- `roll-dice` - Roll the dice
- `move-token` - Move a token
- `send-message` - Send a chat message
- `leave-room` - Leave the current game

### Server → Client
- `player-joined` - New player joined the room
- `game-started` - Game has started
- `dice-rolled` - Dice roll result
- `token-moved` - Token position updated
- `player-turn` - Current player's turn
- `game-over` - Game ended with winner
- `chat-message` - New chat message received

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@ramji023](https://github.com/ramji023)
- LinkedIn: [Ram Ji Mishra](https://www.linkedin.com/in/ram-ji-mishra-2081bb25a/)

## 🙏 Acknowledgments

- Classic Ludo game rules and design
- ws npm package
- React and Zustand communities

## 📞 Support

For support, email mramji747@gmail.com or open an issue in the repository.

---

⭐ If you like this project, please give it a star on GitHub! ⭐
