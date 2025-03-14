import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { getAISuggestion } from "@/lib/chess";

interface ChessBoardProps {
  fen: string;
  onMove?: (move: string) => void;
  flipped?: boolean;
  showControls?: boolean;
}

const ChessBoard = ({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  onMove = () => {},
  flipped = false,
  showControls = true,
}: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<{
    move: string;
    explanation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse FEN string to get board position
  const parseFen = (fen: string) => {
    const [position] = fen.split(" ");
    const rows = position.split("/");
    const board = [];

    for (const row of rows) {
      const boardRow = [];
      for (const char of row) {
        if (isNaN(parseInt(char))) {
          // It's a piece
          boardRow.push(char);
        } else {
          // It's a number, representing empty squares
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null);
          }
        }
      }
      board.push(boardRow);
    }

    return board;
  };

  const board = parseFen(fen);
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  // Get piece component based on piece code
  const getPiece = (piece: string | null) => {
    if (!piece) return null;

    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toLowerCase();

    // Map of piece types to Unicode chess symbols
    const pieceMap: Record<string, string> = {
      k: isWhite ? "♔" : "♚",
      q: isWhite ? "♕" : "♛",
      r: isWhite ? "♖" : "♜",
      b: isWhite ? "♗" : "♝",
      n: isWhite ? "♘" : "♞",
      p: isWhite ? "♙" : "♟",
    };

    return pieceMap[pieceType] || null;
  };

  const handleSquareClick = (file: string, rank: string) => {
    const square = `${file}${rank}`;

    if (selectedSquare) {
      // If a square was already selected, try to make a move
      const move = `${selectedSquare}${square}`;
      onMove(move);
      setSelectedSquare(null);
      setHighlightedSquares([]);
    } else {
      // Select this square
      setSelectedSquare(square);
      setHighlightedSquares([square]);
    }
  };

  const handleGetSuggestion = async () => {
    setLoading(true);
    const result = await getAISuggestion(fen);
    setSuggestion(result);
    setLoading(false);

    if (result) {
      // Highlight the suggested move
      const from = result.move.substring(0, 2);
      const to = result.move.substring(2, 4);
      setHighlightedSquares([from, to]);
    }
  };

  const resetBoard = () => {
    setSelectedSquare(null);
    setHighlightedSquares([]);
    setSuggestion(null);
  };

  // Render the board
  const renderBoard = () => {
    const filesToUse = flipped ? [...files].reverse() : files;
    const ranksToUse = flipped ? [...ranks].reverse() : ranks;

    return (
      <div className="grid grid-cols-8 border border-gray-300 rounded-md overflow-hidden">
        {ranksToUse.map((rank, rankIndex) =>
          React.Children.toArray(
            filesToUse.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isHighlighted = highlightedSquares.includes(square);
              const isDark = (fileIndex + rankIndex) % 2 === 1;
              const piece = board[rankIndex][fileIndex];

              return (
                <div
                  className={`aspect-square flex items-center justify-center text-3xl cursor-pointer
                  ${isDark ? "bg-gray-400" : "bg-gray-200"}
                  ${isHighlighted ? "ring-2 ring-blue-500 ring-inset" : ""}
                  hover:bg-opacity-80 transition-colors`}
                  onClick={() => handleSquareClick(file, rank)}
                >
                  {getPiece(piece)}
                </div>
              );
            }),
          ),
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white p-4 rounded-xl shadow-md">
      <div className="space-y-4">
        {renderBoard()}

        {showControls && (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetBoard}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGetSuggestion}
                disabled={loading}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Get Hint"}
              </Button>
            </div>

            {suggestion && (
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <p className="font-medium">Suggested move: {suggestion.move}</p>
                <p className="text-gray-600 mt-1">{suggestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChessBoard;
