import React, { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Navigate } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";
import GameList from "../chess/GameList";
import GameView from "../chess/GameView";
import { createGame, getUserGames, getGame } from "@/lib/chess";
import { Game } from "@/types/chess";

const ChessPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      if (user) {
        setLoading(true);
        const userGames = await getUserGames(user.id);
        setGames(userGames);
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadGames();
    }
  }, [user, authLoading]);

  const handleCreateGame = async () => {
    if (user) {
      setLoading(true);
      const newGame = await createGame(user.id);
      if (newGame) {
        setGames([newGame, ...games]);
        setSelectedGame(newGame);
      }
      setLoading(false);
    }
  };

  const handleSelectGame = async (gameId: string) => {
    setLoading(true);
    const game = await getGame(gameId);
    if (game) {
      setSelectedGame(game);
    }
    setLoading(false);
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  if (authLoading) {
    return <LoadingScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chess Tutor</h1>

          {selectedGame ? (
            <GameView game={selectedGame} onBack={handleBackToList} />
          ) : (
            <GameList
              games={games}
              onSelectGame={handleSelectGame}
              onCreateGame={handleCreateGame}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessPage;
