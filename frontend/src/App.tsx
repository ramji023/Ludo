import Layout from "./pages/auth/Layout";
import Game from "./pages/game/Game";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import { CreateRoom } from "./pages/auth/CreateRoom";
import { JoinRoom } from "./pages/auth/JoinRoom";
import useSocketStore from "./store/SocketStore";

if (import.meta.env.MODE === "development") {
  (window as any).__store = useSocketStore;
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Register />} />
            {/* <Route path="create-room-form" element={<CreateRoomForm />} />
            <Route path="join-room-form" element={<JoinRoomForm/>} /> */}
            <Route path="create-room" element={<CreateRoom/>} />
            <Route path="join-room" element={<JoinRoom/>} />
          </Route>
          <Route path="game" element={<Game/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
