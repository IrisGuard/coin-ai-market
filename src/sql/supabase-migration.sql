
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create the coins table
CREATE TABLE IF NOT EXISTS coins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  grade TEXT NOT NULL,
  price DECIMAL NOT NULL,
  rarity TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  condition TEXT,
  country TEXT,
  mint TEXT,
  diameter DECIMAL,
  weight DECIMAL,
  composition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  is_auction BOOLEAN DEFAULT FALSE,
  auction_end TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  obverse_image TEXT,
  reverse_image TEXT,
  model_3d_url TEXT,
  authentication_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[]
);

-- Create RLS policies for coins
ALTER TABLE coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coins are viewable by everyone."
  ON coins FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own coins."
  ON coins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coins."
  ON coins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coins."
  ON coins FOR DELETE
  USING (auth.uid() = user_id);

-- Create the bids table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coin_id UUID REFERENCES coins(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for bids
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bids are viewable by everyone."
  ON bids FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own bids."
  ON bids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bids."
  ON bids FOR UPDATE
  USING (auth.uid() = user_id);

-- Create the user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  coin_id UUID REFERENCES coins(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, coin_id)
);

-- Create RLS policies for user_favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User favorites are only viewable by the owner."
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites."
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites."
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  related_coin_id UUID REFERENCES coins(id),
  action_url TEXT
);

-- Create RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications are only viewable by the owner."
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications."
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications."
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create a table for coin transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coin_id UUID REFERENCES coins(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'cancelled', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'purchase' -- 'purchase', 'auction'
);

-- Create RLS policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions are viewable by the involved parties."
  ON transactions FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Create a table for expert evaluations of coins
CREATE TABLE IF NOT EXISTS coin_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coin_id UUID REFERENCES coins(id) NOT NULL,
  expert_id UUID REFERENCES profiles(id),
  grade TEXT NOT NULL,
  estimated_value DECIMAL NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for coin_evaluations
ALTER TABLE coin_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coin evaluations are viewable by everyone."
  ON coin_evaluations FOR SELECT
  USING (true);

CREATE POLICY "Only experts can insert evaluations."
  ON coin_evaluations FOR INSERT
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Only the expert who created an evaluation can update it."
  ON coin_evaluations FOR UPDATE
  USING (auth.uid() = expert_id);

-- Create a function to handle bid notifications
CREATE OR REPLACE FUNCTION handle_new_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the coin information
  DECLARE
    coin_name TEXT;
    coin_seller_id UUID;
    current_price DECIMAL;
    is_highest BOOLEAN;
  BEGIN
    SELECT name, user_id, price INTO coin_name, coin_seller_id, current_price FROM coins WHERE id = NEW.coin_id;
    
    -- Check if this is the highest bid
    SELECT COUNT(*) = 0 INTO is_highest FROM bids 
    WHERE coin_id = NEW.coin_id AND amount > NEW.amount;
    
    -- Create a notification for the seller
    IF coin_seller_id IS NOT NULL AND coin_seller_id != NEW.user_id AND is_highest THEN
      INSERT INTO notifications (user_id, message, type, related_coin_id, action_url)
      VALUES (
        coin_seller_id,
        'New highest bid of $' || NEW.amount || ' on your coin ' || coin_name,
        'bid',
        NEW.coin_id,
        '/coins/' || NEW.coin_id
      );
    END IF;
    
    -- Notify previous highest bidder if they were outbid
    IF is_highest THEN
      WITH previous_highest AS (
        SELECT DISTINCT ON (coin_id) user_id, amount
        FROM bids
        WHERE coin_id = NEW.coin_id AND user_id != NEW.user_id
        ORDER BY coin_id, amount DESC
        LIMIT 1
      )
      INSERT INTO notifications (user_id, message, type, related_coin_id, action_url)
      SELECT 
        user_id, 
        'You have been outbid on ' || coin_name || '. The new highest bid is $' || NEW.amount, 
        'outbid',
        NEW.coin_id,
        '/coins/' || NEW.coin_id
      FROM previous_highest
      WHERE amount < NEW.amount;
      
      -- Update the coin price to the new highest bid
      IF NEW.amount > current_price THEN
        UPDATE coins SET price = NEW.amount WHERE id = NEW.coin_id;
      END IF;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for new bids
DROP TRIGGER IF EXISTS on_new_bid ON bids;
CREATE TRIGGER on_new_bid
  AFTER INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_bid();

-- Create a function to handle auction end
CREATE OR REPLACE FUNCTION check_auction_end()
RETURNS VOID AS $$
DECLARE
  ended_auction RECORD;
  highest_bidder UUID;
  highest_bid DECIMAL;
BEGIN
  FOR ended_auction IN 
    SELECT * FROM coins 
    WHERE is_auction = TRUE 
    AND auction_end <= NOW()
    AND auction_end > NOW() - INTERVAL '5 minutes'
  LOOP
    -- Find the highest bidder
    SELECT user_id, amount INTO highest_bidder, highest_bid 
    FROM bids 
    WHERE coin_id = ended_auction.id 
    ORDER BY amount DESC 
    LIMIT 1;
    
    IF highest_bidder IS NOT NULL THEN
      -- Create a transaction record
      INSERT INTO transactions (
        coin_id, 
        seller_id, 
        buyer_id, 
        amount, 
        status,
        transaction_type
      ) VALUES (
        ended_auction.id,
        ended_auction.user_id,
        highest_bidder,
        highest_bid,
        'completed',
        'auction'
      );
      
      -- Notify the winner
      INSERT INTO notifications (user_id, message, type, related_coin_id, action_url)
      VALUES (
        highest_bidder,
        'Congratulations! You won the auction for ' || ended_auction.name || ' with a bid of $' || highest_bid,
        'auction_end',
        ended_auction.id,
        '/coins/' || ended_auction.id
      );
      
      -- Notify the seller
      INSERT INTO notifications (user_id, message, type, related_coin_id, action_url)
      VALUES (
        ended_auction.user_id,
        'Your auction for ' || ended_auction.name || ' has ended. The winning bid was $' || highest_bid,
        'auction_end',
        ended_auction.id,
        '/coins/' || ended_auction.id
      );
    ELSE
      -- No bids, notify the seller
      INSERT INTO notifications (user_id, message, type, related_coin_id, action_url)
      VALUES (
        ended_auction.user_id,
        'Your auction for ' || ended_auction.name || ' has ended with no bids.',
        'auction_end',
        ended_auction.id,
        '/coins/' || ended_auction.id
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled function that runs every 5 minutes
SELECT cron.schedule(
  'check-auctions',
  '*/5 * * * *',
  'SELECT check_auction_end()'
);

-- Create a function to update profile reputation
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  -- Increase seller reputation after successful transaction
  UPDATE profiles 
  SET reputation = reputation + 5
  WHERE id = NEW.seller_id;
  
  -- Increase buyer reputation after successful transaction
  UPDATE profiles 
  SET reputation = reputation + 2
  WHERE id = NEW.buyer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for new transactions
DROP TRIGGER IF EXISTS on_new_transaction ON transactions;
CREATE TRIGGER on_new_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_user_reputation();

-- Create a statistics view for coins and marketplace
CREATE OR REPLACE VIEW marketplace_stats AS
SELECT
  (SELECT COUNT(*) FROM coins WHERE is_auction = FALSE) as listed_coins,
  (SELECT COUNT(*) FROM coins WHERE is_auction = TRUE AND auction_end > NOW()) as active_auctions,
  (SELECT COUNT(DISTINCT user_id) FROM profiles) as registered_users,
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed') as total_volume,
  (SELECT COUNT(*) FROM transactions WHERE status = 'completed' AND created_at > NOW() - INTERVAL '7 days') as weekly_transactions
;

-- Add a storage function for easy image uploads
CREATE OR REPLACE FUNCTION generate_presigned_url(bucket_name TEXT, file_name TEXT)
RETURNS TEXT AS $$
DECLARE
  presigned_url TEXT;
BEGIN
  -- This is just a placeholder function - in real Supabase, this would be handled by Storage APIs
  presigned_url := 'https://' || bucket_name || '.supabase.co/' || file_name;
  RETURN presigned_url;
END;
$$ LANGUAGE plpgsql;

-- Create a search index for coins for better performance
CREATE INDEX IF NOT EXISTS coins_search_idx ON coins USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || 
  coalesce(description, '') || ' ' || 
  coalesce(country, '') || ' ' || 
  coalesce(mint, '') || ' ' || 
  coalesce(composition, '')
));
