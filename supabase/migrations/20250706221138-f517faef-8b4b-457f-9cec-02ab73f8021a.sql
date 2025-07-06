-- Phase 2B.1a: Extend coin_category enum with new categories (first transaction)
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'banknotes';
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'error_banknotes';  
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'gold_bullion';
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'silver_bullion';