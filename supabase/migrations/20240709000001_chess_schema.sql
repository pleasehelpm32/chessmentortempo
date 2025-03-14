-- Create Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  current_fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  white_player_id UUID REFERENCES auth.users(id),
  black_player_id UUID REFERENCES auth.users(id)
);

-- Create Moves table
CREATE TABLE IF NOT EXISTS moves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  fen_before TEXT NOT NULL,
  move_san TEXT NOT NULL,
  explanation TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Enable RLS on moves
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own games
DROP POLICY IF EXISTS "Users can view their own games" ON games;
CREATE POLICY "Users can view their own games"
ON games FOR SELECT
USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Create policy for users to insert their own games
DROP POLICY IF EXISTS "Users can insert their own games" ON games;
CREATE POLICY "Users can insert their own games"
ON games FOR INSERT
WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Create policy for users to update their own games
DROP POLICY IF EXISTS "Users can update their own games" ON games;
CREATE POLICY "Users can update their own games"
ON games FOR UPDATE
USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Create policy for users to view moves from their games
DROP POLICY IF EXISTS "Users can view moves from their games" ON moves;
CREATE POLICY "Users can view moves from their games"
ON moves FOR SELECT
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = moves.game_id
  AND (games.white_player_id = auth.uid() OR games.black_player_id = auth.uid())
));

-- Create policy for users to insert moves to their games
DROP POLICY IF EXISTS "Users can insert moves to their games" ON moves;
CREATE POLICY "Users can insert moves to their games"
ON moves FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = moves.game_id
  AND (games.white_player_id = auth.uid() OR games.black_player_id = auth.uid())
));

-- Enable realtime for games and moves
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table moves;
