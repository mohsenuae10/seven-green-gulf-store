-- Update site_content features section to English
UPDATE site_content 
SET 
  title = 'Product Features',
  description = 'Main benefits of Seven Green',
  content = jsonb_build_object(
    'benefits', ARRAY[
      '97% improvement in hair density',
      '85% reduction in hair loss', 
      '92% increase in shine',
      '4 weeks to see results'
    ]
  )
WHERE section = 'features';