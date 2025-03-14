import { supabase } from "../../supabase/supabase";
import { Game, Move } from "@/types/chess";

// Game management functions
export async function createGame(
  whitePlayerId: string,
  blackPlayerId?: string,
): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .insert({
      white_player_id: whitePlayerId,
      black_player_id: blackPlayerId || null,
      status: "active",
      current_fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating game:", error);
    return null;
  }

  return data as Game;
}

export async function getGame(gameId: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error) {
    console.error("Error fetching game:", error);
    return null;
  }

  return data as Game;
}

export async function getUserGames(userId: string): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user games:", error);
    return [];
  }

  return data as Game[];
}

export async function updateGameStatus(
  gameId: string,
  status: "active" | "completed" | "abandoned",
): Promise<boolean> {
  const { error } = await supabase
    .from("games")
    .update({ status })
    .eq("id", gameId);

  if (error) {
    console.error("Error updating game status:", error);
    return false;
  }

  return true;
}

export async function updateGamePosition(
  gameId: string,
  fen: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("games")
    .update({ current_fen: fen })
    .eq("id", gameId);

  if (error) {
    console.error("Error updating game position:", error);
    return false;
  }

  return true;
}

// Move management functions
export async function recordMove(
  gameId: string,
  fenBefore: string,
  moveSan: string,
  explanation?: string,
): Promise<Move | null> {
  const { data, error } = await supabase
    .from("moves")
    .insert({
      game_id: gameId,
      fen_before: fenBefore,
      move_san: moveSan,
      explanation: explanation || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error recording move:", error);
    return null;
  }

  return data as Move;
}

export async function getGameMoves(gameId: string): Promise<Move[]> {
  const { data, error } = await supabase
    .from("moves")
    .select("*")
    .eq("game_id", gameId)
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching game moves:", error);
    return [];
  }

  return data as Move[];
}

// AI suggestion function (placeholder - would connect to an actual chess engine API)
export async function getAISuggestion(
  fen: string,
): Promise<{ move: string; explanation: string } | null> {
  // This would be replaced with an actual API call to a chess engine or AI service
  // For now, return a placeholder response
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a placeholder suggestion
    return {
      move: "e2e4", // Example move in UCI format
      explanation:
        "This is a strong opening move that controls the center and opens lines for your bishop and queen.",
    };
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
    return null;
  }
}
