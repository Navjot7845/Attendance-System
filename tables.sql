-- Create ENUM for user types
CREATE TYPE user_type AS ENUM ('admin', 'student', 'teacher');

-- Create Users Table
CREATE TABLE users (
    uid TEXT PRIMARY KEY,  -- Changed to TEXT for flexibility
    roll_no INT UNIQUE,  -- Assuming roll number is unique
    name TEXT NOT NULL,  
    email TEXT UNIQUE NOT NULL,  
    batch TEXT,
    password TEXT NOT NULL CHECK (LENGTH(password) >= 7),
    token TEXT NOT NULL,
    type user_type NOT NULL DEFAULT 'student'
);


-- FOR OTP TABLE
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE TABLE otps (
    email TEXT,
    otp TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Auto-delete expired OTPs every 5 minutes
SELECT cron.schedule(
    '*/5 * * * *',  
    'DELETE FROM otps WHERE created_at < NOW() - INTERVAL ''5 minutes'';'
);

-- FOR RESET PASSWORD LINKS TABLE

CREATE TABLE password_reset_links (
    uid TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- Auto-delete expired password reset links every 5 minutes
SELECT cron.schedule(
    '*/5 * * * *',  
    'DELETE FROM password_reset_links WHERE created_at < NOW() - INTERVAL ''5 minutes'';'
);

-- FOR ATTENDANCE TABLE
CREATE TABLE attendance (
    uid TEXT NOT NULL,
    time TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- Procedure to update and set the attendance of the user
CREATE OR REPLACE PROCEDURE add_attendance(uid_input TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Ensure user exists before adding attendance
    IF EXISTS (SELECT 1 FROM users WHERE uid = uid_input) THEN
        INSERT INTO attendance (uid, time)
        VALUES (uid_input, CURRENT_TIMESTAMP);
    ELSE
        RAISE EXCEPTION 'User does not exist';
    END IF;
END;
$$;
