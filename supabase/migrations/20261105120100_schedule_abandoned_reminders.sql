-- Automatically email ONE payment reminder to customers who left checkout
-- without paying (order older than 1 hour, younger than 48 hours, has an
-- email, no reminder sent yet). The selection logic lives in the
-- send-payment-reminder edge function ("batch" mode); this job just calls it
-- every 15 minutes.
--
-- Batch mode takes no input and only ever sends to orders that qualify, at
-- most once per order, so the endpoint is safe to call without a secret.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- cron.schedule() with an existing job name updates that job in place.
SELECT cron.schedule(
  'abandoned-cart-reminders',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://dnvchztawygtkdddsiwn.supabase.co/functions/v1/send-payment-reminder',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "batch"}'::jsonb
  );
  $$
);
