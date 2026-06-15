import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./main.scss";
import App from "./App";
import { LobbyScreen } from "@/components/ui/lobby/LobbyScreen";
import { CharacterCreate } from "@/components/ui/overlay/characterCreate/CharacterCreate";
import { useGameStore } from "@/stores/gameStore";

function GameRoute() {
  const hasCharacter = useGameStore((s) => s.character.cls !== null);
  return hasCharacter ? <App /> : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <LobbyScreen /> },
  { path: "/character/create", element: <CharacterCreate /> },
  { path: "/game", element: <GameRoute /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
