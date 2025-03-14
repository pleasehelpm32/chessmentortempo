import ChessBoard from "@/components/chess/ChessBoard";

export default function ChessBoardStory() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Chess Board Component</h1>
      <div className="max-w-md mx-auto">
        <ChessBoard
          fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          showControls={true}
        />
      </div>
    </div>
  );
}
