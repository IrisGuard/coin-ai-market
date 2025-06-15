
-- Check if transactions table needs RLS policies for Phase 4
-- Only add policies if transactions table will be used for payment flow

-- Allow users to insert their own transactions
CREATE POLICY "transactions_user_insert"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Allow users to read their own transactions (as buyer or seller)
CREATE POLICY "transactions_user_read"
ON public.transactions
FOR SELECT
TO authenticated
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Allow admins to read all transactions
CREATE POLICY "transactions_admin_read"
ON public.transactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to update their own transactions (for status changes)
CREATE POLICY "transactions_user_update"
ON public.transactions
FOR UPDATE
TO authenticated
USING (buyer_id = auth.uid() OR seller_id = auth.uid());
