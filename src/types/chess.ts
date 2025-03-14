export interface Game {
  id: string;
  created_at: string;
  status: "active" | "completed" | "abandoned";
  current_fen: string;
  white_player_id: string;
  black_player_id: string | null;
}

export interface Move {
  id: string;
  game_id: string;
  fen_before: string;
  move_san: string;
  explanation: string | null;
  timestamp: string;
}

export interface ChessPosition {
  fen: string;
  turn: "w" | "b";
  moveNumber: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}
