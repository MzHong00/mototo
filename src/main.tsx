import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./main.scss";
import GameScreen from "@/screens/game/GameScreen";
import { LobbyScreen } from "@/screens/lobby/LobbyScreen";
import { CharacterCreateScreen } from "@/screens/characterCreate/CharacterCreateScreen";
import { useGameStore } from "@/stores/gameStore";

function GameRoute() {
  const hasCharacter = useGameStore((s) => s.character.cls !== null);
  return hasCharacter ? <GameScreen /> : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <LobbyScreen /> },
  { path: "/character/create", element: <CharacterCreateScreen /> },
  { path: "/game", element: <GameRoute /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
