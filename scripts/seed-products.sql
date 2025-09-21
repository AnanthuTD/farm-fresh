-- Seed initial products for the meat shop
-- This will populate the products collection with sample data

INSERT INTO products (id, name, category, price, image, description, cutTypes, skinOptions, available, createdAt, updatedAt) VALUES
('chicken-breast', 'Chicken Breast', 'chicken', 280, '/placeholder.svg?height=300&width=300', 'Premium boneless chicken breast, perfect for grilling and roasting', ['Whole', 'Pieces', 'Boneless'], ['Skin On', 'Skin Off'], true, NOW(), NOW()),
('fish-salmon', 'Fresh Salmon', 'fish', 450, '/placeholder.svg?height=300&width=300', 'Fresh Atlantic salmon, rich in omega-3 fatty acids', ['Whole', 'Fillet', 'Steaks'], [], true, NOW(), NOW()),
('beef-steak', 'Beef Ribeye Steak', 'beef', 650, '/placeholder.svg?height=300&width=300', 'Premium ribeye steak, perfectly marbled for maximum flavor', ['Whole', 'Steaks', 'Cubes'], [], true, NOW(), NOW()),
('chicken-wings', 'Chicken Wings', 'chicken', 220, '/placeholder.svg?height=300&width=300', 'Fresh chicken wings, great for BBQ and frying', ['Whole', 'Split'], ['Skin On', 'Skin Off'], true, NOW(), NOW()),
('fish-tuna', 'Fresh Tuna', 'fish', 380, '/placeholder.svg?height=300&width=300', 'Fresh yellowfin tuna, perfect for sashimi and grilling', ['Whole', 'Steaks', 'Cubes'], [], true, NOW(), NOW()),
('beef-mince', 'Beef Mince', 'beef', 320, '/placeholder.svg?height=300&width=300', 'Fresh ground beef, ideal for burgers and meatballs', ['Regular', 'Lean', 'Extra Lean'], [], true, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  price = VALUES(price),
  description = VALUES(description),
  updatedAt = NOW();
