import GameBoard from "./pages/gameBoard/GameBoard";
import GamePage from "./pages/GamePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LudoStateContextProvider } from "./context/Ludo";
import Lobby from "./pages/lobby/Lobby";
export default function App() {
  return (
    <>
      <LudoStateContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<GameBoard />} />
          </Routes>
        </BrowserRouter>
      </LudoStateContextProvider>
    </>
  );
}
