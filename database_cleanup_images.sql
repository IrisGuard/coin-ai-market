
-- Clean up empty image entries from coins table
UPDATE coins 
SET images = (
  SELECT array_agg(img ORDER BY ordinality)
  FROM unnest(images) WITH ORDINALITY AS t(img, ordinality)
  WHERE img IS NOT NULL 
    AND img != '' 
    AND img != 'null' 
    AND img != 'undefined'
    AND NOT img LIKE 'blob:%'
    AND (img LIKE 'http%' OR img LIKE '/%')
)
WHERE images IS NOT NULL 
  AND array_length(images, 1) > 0;

-- Remove completely empty image arrays
UPDATE coins 
SET images = NULL 
WHERE images = '{}' OR images IS NULL OR array_length(images, 1) = 0;

-- Update specific problematic coins with clean arrays
UPDATE coins 
SET images = CASE 
  WHEN images IS NOT NULL THEN (
    SELECT array_agg(img ORDER BY ordinality)
    FROM unnest(images) WITH ORDINALITY AS t(img, ordinality)
    WHERE img IS NOT NULL 
      AND img != '' 
      AND img != 'null' 
      AND img != 'undefined'
      AND NOT img LIKE 'blob:%'
      AND (img LIKE 'http%' OR img LIKE '/%')
  )
  ELSE NULL
END
WHERE id IN (
  SELECT id FROM coins 
  WHERE array_length(images, 1) != (
    SELECT count(*)
    FROM unnest(images) AS img
    WHERE img IS NOT NULL 
      AND img != '' 
      AND img != 'null' 
      AND img != 'undefined'
      AND NOT img LIKE 'blob:%'
      AND (img LIKE 'http%' OR img LIKE '/%')
  )
);
