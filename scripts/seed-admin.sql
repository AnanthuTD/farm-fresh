-- Create admin user for the meat shop
-- Default credentials: admin / admin123
-- In production, passwords should be properly hashed

INSERT INTO admin_users (username, password, createdAt) 
VALUES ('admin', 'admin123', NOW())
ON DUPLICATE KEY UPDATE password = 'admin123';
