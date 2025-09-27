-- Add shipping fields to orders table
ALTER TABLE public.orders 
ADD COLUMN tracking_number TEXT,
ADD COLUMN shipping_company TEXT,
ADD COLUMN seller_notes TEXT,
ADD COLUMN shipped_at TIMESTAMP WITH TIME ZONE;