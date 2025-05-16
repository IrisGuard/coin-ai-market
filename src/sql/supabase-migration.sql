
-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
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
  model_3d_url TEXT
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
  related_coin_id UUID REFERENCES coins(id)
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

-- Create a function to handle bid notifications
CREATE OR REPLACE FUNCTION handle_new_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the coin information
  DECLARE
    coin_name TEXT;
    coin_seller_id UUID;
  BEGIN
    SELECT name, user_id INTO coin_name, coin_seller_id FROM coins WHERE id = NEW.coin_id;
    
    -- Create a notification for the seller
    IF coin_seller_id IS NOT NULL AND coin_seller_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, message, type, related_coin_id)
      VALUES (
        coin_seller_id,
        'Someone placed a bid of $' || NEW.amount || ' on your coin ' || coin_name,
        'bid',
        NEW.coin_id
      );
    END IF;
  END;
  
  -- Update the coin price
  UPDATE coins SET price = NEW.amount WHERE id = NEW.coin_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for new bids
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
      -- Notify the winner
      INSERT INTO notifications (user_id, message, type, related_coin_id)
      VALUES (
        highest_bidder,
        'Congratulations! You won the auction for ' || ended_auction.name || ' with a bid of $' || highest_bid,
        'auction_end',
        ended_auction.id
      );
      
      -- Notify the seller
      INSERT INTO notifications (user_id, message, type, related_coin_id)
      VALUES (
        ended_auction.user_id,
        'Your auction for ' || ended_auction.name || ' has ended. The winning bid was $' || highest_bid,
        'auction_end',
        ended_auction.id
      );
    ELSE
      -- No bids, notify the seller
      INSERT INTO notifications (user_id, message, type, related_coin_id)
      VALUES (
        ended_auction.user_id,
        'Your auction for ' || ended_auction.name || ' has ended with no bids.',
        'auction_end',
        ended_auction.id
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
