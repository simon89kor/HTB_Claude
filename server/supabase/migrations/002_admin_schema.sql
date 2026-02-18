-- HTB Admin Schema

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'sales')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create default super admin (password: admin1234 - should be changed)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@htb.com', crypt('admin1234', gen_salt('bf')), 'Super Admin', 'super_admin');

-- Add admin tracking columns to routines
ALTER TABLE routines ADD COLUMN IF NOT EXISTS created_by_admin UUID REFERENCES admin_users(id);
ALTER TABLE routines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add user status for ban/suspend
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));

-- Add post status for moderation
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted'));

-- Indexes for admin queries
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_posts_status ON posts(status);

-- Function: Verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(input_email TEXT, input_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM admin_users
  WHERE email = input_email;

  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update admin password
CREATE OR REPLACE FUNCTION update_admin_password(admin_id UUID, new_password TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE admin_users
  SET password_hash = crypt(new_password, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create admin with hashed password
CREATE OR REPLACE FUNCTION create_admin_user(
  input_email TEXT,
  input_password TEXT,
  input_name VARCHAR(50),
  input_role VARCHAR(20)
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO admin_users (email, password_hash, name, role)
  VALUES (input_email, crypt(input_password, gen_salt('bf')), input_name, input_role)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
