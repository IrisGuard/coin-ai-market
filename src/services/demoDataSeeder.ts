
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DemoCoin {
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: string;
  country: string;
  denomination: string;
  condition: string;
  description: string;
  composition: string;
  diameter: number;
  weight: number;
  mint: string;
  image: string;
  authentication_status: string;
  is_auction?: boolean;
  starting_bid?: number;
}

const demoCoins: DemoCoin[] = [
  {
    name: "Morgan Silver Dollar",
    year: 1921,
    grade: "MS-65",
    price: 850,
    rarity: "Uncommon",
    country: "United States",
    denomination: "Dollar",
    condition: "Mint State",
    description: "Beautiful 1921 Morgan Silver Dollar in exceptional condition. Last year of original production with crisp details and lustrous surfaces.",
    composition: "90% Silver, 10% Copper",
    diameter: 38.1,
    weight: 26.73,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Peace Silver Dollar",
    year: 1922,
    grade: "AU-58",
    price: 45,
    rarity: "Common",
    country: "United States",
    denomination: "Dollar",
    condition: "About Uncirculated",
    description: "Classic Peace Dollar from the first year of production. Symbolic design representing peace after World War I.",
    composition: "90% Silver, 10% Copper",
    diameter: 38.1,
    weight: 26.73,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Walking Liberty Half Dollar",
    year: 1943,
    grade: "XF-45",
    price: 25,
    rarity: "Common",
    country: "United States",
    denomination: "Half Dollar",
    condition: "Extremely Fine",
    description: "Wartime silver half dollar with beautiful Walking Liberty design. Clear details with light wear.",
    composition: "90% Silver, 10% Copper",
    diameter: 30.6,
    weight: 12.5,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Mercury Dime",
    year: 1942,
    grade: "MS-64",
    price: 15,
    rarity: "Common",
    country: "United States",
    denomination: "Dime",
    condition: "Mint State",
    description: "Beautiful Mercury dime with full bands and lustrous surfaces. Popular wartime issue.",
    composition: "90% Silver, 10% Copper",
    diameter: 17.9,
    weight: 2.5,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "American Gold Eagle",
    year: 2023,
    grade: "MS-70",
    price: 2450,
    rarity: "Common",
    country: "United States",
    denomination: "50 Dollars",
    condition: "Mint State",
    description: "Modern 1 oz Gold Eagle in perfect condition. Beautiful proof finish with deep cameo contrast.",
    composition: "91.67% Gold, 5.33% Copper, 3% Silver",
    diameter: 32.7,
    weight: 33.93,
    mint: "West Point",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "American Silver Eagle",
    year: 2024,
    grade: "MS-69",
    price: 45,
    rarity: "Common",
    country: "United States",
    denomination: "1 Dollar",
    condition: "Mint State",
    description: "Current year Silver Eagle with beautiful heraldic eagle reverse. Near perfect condition.",
    composition: "99.9% Silver",
    diameter: 40.6,
    weight: 31.101,
    mint: "West Point",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Franklin Half Dollar",
    year: 1963,
    grade: "MS-63",
    price: 18,
    rarity: "Common",
    country: "United States",
    denomination: "Half Dollar",
    condition: "Mint State",
    description: "Last year Franklin half dollar before Kennedy half production. Clean surfaces with good luster.",
    composition: "90% Silver, 10% Copper",
    diameter: 30.6,
    weight: 12.5,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Indian Head Penny",
    year: 1906,
    grade: "VF-30",
    price: 8,
    rarity: "Common",
    country: "United States",
    denomination: "Cent",
    condition: "Very Fine",
    description: "Classic Indian Head cent with clear date and details. Popular with collectors of all levels.",
    composition: "95% Copper, 5% Tin and Zinc",
    diameter: 19.05,
    weight: 3.11,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Buffalo Nickel",
    year: 1937,
    grade: "AU-55",
    price: 12,
    rarity: "Common",
    country: "United States",
    denomination: "5 Cents",
    condition: "About Uncirculated",
    description: "Three-legged buffalo variety. Scarce mint error with clear details and attractive toning.",
    composition: "75% Copper, 25% Nickel",
    diameter: 21.21,
    weight: 5.0,
    mint: "Denver",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Standing Liberty Quarter",
    year: 1930,
    grade: "VF-20",
    price: 35,
    rarity: "Common",
    country: "United States",
    denomination: "Quarter",
    condition: "Very Fine",
    description: "Beautiful Standing Liberty quarter with full date and clear details. Attractive natural toning.",
    composition: "90% Silver, 10% Copper",
    diameter: 24.3,
    weight: 6.25,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Eisenhower Dollar",
    year: 1976,
    grade: "MS-64",
    price: 8,
    rarity: "Common",
    country: "United States",
    denomination: "Dollar",
    condition: "Mint State",
    description: "Bicentennial Eisenhower dollar with dual date 1776-1976. Popular commemorative issue.",
    composition: "75% Copper, 25% Nickel",
    diameter: 38.1,
    weight: 22.68,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  {
    name: "Kennedy Half Dollar",
    year: 1964,
    grade: "MS-65",
    price: 22,
    rarity: "Common",
    country: "United States",
    denomination: "Half Dollar",
    condition: "Mint State",
    description: "First year Kennedy half dollar in 90% silver. Emotional tribute coin in exceptional condition.",
    composition: "90% Silver, 10% Copper",
    diameter: 30.6,
    weight: 12.5,
    mint: "Philadelphia",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified"
  },
  // Add some auction coins
  {
    name: "1893-S Morgan Dollar",
    year: 1893,
    grade: "AU-50",
    price: 0,
    rarity: "Very Rare",
    country: "United States",
    denomination: "Dollar",
    condition: "About Uncirculated",
    description: "Key date Morgan dollar from San Francisco. Extremely scarce and highly sought after by collectors worldwide.",
    composition: "90% Silver, 10% Copper",
    diameter: 38.1,
    weight: 26.73,
    mint: "San Francisco",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified",
    is_auction: true,
    starting_bid: 2500
  },
  {
    name: "1916-D Mercury Dime",
    year: 1916,
    grade: "VG-8",
    price: 0,
    rarity: "Rare",
    country: "United States",
    denomination: "Dime",
    condition: "Very Good",
    description: "Key date Mercury dime from Denver mint. First year of issue and highly collectible.",
    composition: "90% Silver, 10% Copper",
    diameter: 17.9,
    weight: 2.5,
    mint: "Denver",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    authentication_status: "verified",
    is_auction: true,
    starting_bid: 850
  },
  {
    name: "1909-S VDB Lincoln Cent",
    year: 1909,
    grade: "VF-25",
    price: 0,
    rarity: "Rare",
    country: "United States",
    denomination: "Cent",
    condition: "Very Fine",
    description: "Holy grail of Lincoln cents. First year with designer initials, San Francisco mint.",
    composition: "95% Copper, 5% Tin and Zinc",
    diameter: 19.05,
    weight: 3.11,
    mint: "San Francisco",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
    authentication_status: "verified",
    is_auction: true,
    starting_bid: 650
  }
];

// Create demo user profile
const createDemoUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) return existingProfile;

  // Create profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([{
      id: user.id,
      name: 'Demo User',
      email: user.email,
      verified_dealer: true,
      reputation: 98,
      bio: 'Professional coin dealer with over 20 years of experience in numismatics.'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating demo user:', error);
    return null;
  }

  return profile;
};

export const seedDemoData = async () => {
  try {
    // Check if demo data already exists
    const { data: existingCoins } = await supabase
      .from('coins')
      .select('id')
      .limit(1);

    if (existingCoins && existingCoins.length > 0) {
      toast.info('Demo data already exists');
      return { success: true, message: 'Demo data already loaded' };
    }

    // Create demo user profile first
    const profile = await createDemoUser();
    if (!profile) {
      throw new Error('Failed to create demo user profile');
    }

    // Insert demo coins
    const coinsToInsert = demoCoins.map(coin => ({
      ...coin,
      user_id: profile.id,
      seller_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      auction_end: coin.is_auction ? 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : // 7 days from now
        null
    }));

    const { data: insertedCoins, error } = await supabase
      .from('coins')
      .insert(coinsToInsert)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`Successfully created ${insertedCoins?.length || 0} demo coins!`);
    
    return { 
      success: true, 
      message: `Created ${insertedCoins?.length || 0} demo coins`,
      data: insertedCoins 
    };

  } catch (error) {
    console.error('Error seeding demo data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to create demo data: ${errorMessage}`);
    
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};

export const clearDemoData = async () => {
  try {
    const { error } = await supabase
      .from('coins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all coins

    if (error) {
      throw error;
    }

    toast.success('Demo data cleared successfully');
    return { success: true, message: 'Demo data cleared' };

  } catch (error) {
    console.error('Error clearing demo data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to clear demo data: ${errorMessage}`);
    
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};
