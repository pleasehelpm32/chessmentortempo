import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/chess";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Plus } from "lucide-react";

interface GameListProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onCreateGame: () => void;
  isLoading?: boolean;
}

const GameList = ({
  games = [],
  onSelectGame,
  onCreateGame,
  isLoading = false,
}: GameListProps) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex justify-between items-center">
            <span>Your Games</span>
            <Button disabled className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex justify-between items-center">
          <span>Your Games</span>
          <Button onClick={onCreateGame} className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any games yet.</p>
            <Button onClick={onCreateGame} className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Start a new game
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectGame(game.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Game #{game.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(game.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${game.status === "active" ? "bg-green-100 text-green-800" : game.status === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {game.status.charAt(0).toUpperCase() +
                        game.status.slice(1)}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameList;
