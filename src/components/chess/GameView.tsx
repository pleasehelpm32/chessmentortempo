import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import ChessBoard from "./ChessBoard";
import { Game, Move } from "@/types/chess";
import { getGameMoves, recordMove, updateGamePosition } from "@/lib/chess";
import { formatDistanceToNow } from "date-fns";

interface GameViewProps {
  game: Game;
  onBack: () => void;
}

const GameView = ({ game, onBack }: GameViewProps) => {
  const [currentFen, setCurrentFen] = useState(game.current_fen);
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoves = async () => {
      setLoading(true);
      const gameMoves = await getGameMoves(game.id);
      setMoves(gameMoves);
      setLoading(false);
    };

    loadMoves();
  }, [game.id]);

  const handleMove = async (move: string) => {
    // In a real implementation, this would validate the move and update the FEN
    // For now, we'll just record the move with the current FEN
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    const moveSan = `${from}-${to}`; // Simplified SAN format

    // Record the move
    await recordMove(game.id, currentFen, moveSan);

    // Update the game's current position
    // In a real implementation, this would calculate the new FEN based on the move
    // For now, we'll just keep the same FEN
    await updateGamePosition(game.id, currentFen);

    // Refresh the moves list
    const gameMoves = await getGameMoves(game.id);
    setMoves(gameMoves);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold">Game #{game.id.substring(0, 8)}</h2>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Game
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChessBoard fen={currentFen} onMove={handleMove} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Move History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : moves.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No moves yet. Make the first move!
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {moves.map((move, index) => (
                    <div
                      key={move.id}
                      className="border-b border-gray-100 pb-2 last:border-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">
                            {Math.floor(index / 2) + 1}.
                            {index % 2 === 0 ? "" : ".."}{" "}
                          </span>
                          <span>{move.move_san}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(move.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      {move.explanation && (
                        <p className="text-sm text-gray-600 mt-1">
                          {move.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameView;
