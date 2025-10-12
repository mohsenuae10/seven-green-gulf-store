-- Add product page to sitemap
INSERT INTO page_updates (page_slug, change_frequency, priority, last_modified, created_at, updated_at)
VALUES ('/product', 'weekly', 0.9, NOW(), NOW(), NOW())
ON CONFLICT (page_slug) DO UPDATE
SET last_modified = NOW(), updated_at = NOW(), priority = 0.9;