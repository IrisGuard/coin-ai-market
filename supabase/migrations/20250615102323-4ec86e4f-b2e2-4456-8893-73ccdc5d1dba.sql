
-- Phase 1: Add wallet and banking fields to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS solana_wallet_address text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS ethereum_wallet_address text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS bitcoin_wallet_address text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS usdc_wallet_address text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS iban text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS swift_bic text;

-- Add comments for documentation
COMMENT ON COLUMN public.stores.solana_wallet_address IS 'Dealer Solana wallet address for receiving crypto payments';
COMMENT ON COLUMN public.stores.ethereum_wallet_address IS 'Dealer Ethereum wallet address for receiving crypto payments';
COMMENT ON COLUMN public.stores.bitcoin_wallet_address IS 'Dealer Bitcoin wallet address for receiving crypto payments';
COMMENT ON COLUMN public.stores.usdc_wallet_address IS 'Dealer USDC wallet address for receiving stablecoin payments';
COMMENT ON COLUMN public.stores.bank_name IS 'Dealer bank name for traditional banking transfers';
COMMENT ON COLUMN public.stores.iban IS 'Dealer IBAN for international bank transfers';
COMMENT ON COLUMN public.stores.swift_bic IS 'Dealer SWIFT/BIC code for international bank transfers';
