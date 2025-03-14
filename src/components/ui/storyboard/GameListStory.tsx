import GameList from "@/components/chess/GameList";

export default function GameListStory() {
  const mockGames = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      created_at: new Date().toISOString(),
      status: "active",
      current_fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      white_player_id: "user-123",
      black_player_id: null,
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "completed",
      current_fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      white_player_id: "user-123",
      black_player_id: "user-456",
    },
    {
      id: "323e4567-e89b-12d3-a456-426614174002",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "abandoned",
      current_fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      white_player_id: "user-456",
      black_player_id: "user-123",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Game List Component</h1>
      <div className="max-w-3xl mx-auto">
        <GameList
          games={mockGames}
          onSelectGame={(id) => console.log(`Selected game: ${id}`)}
          onCreateGame={() => console.log("Create new game")}
        />
      </div>
    </div>
  );
}
