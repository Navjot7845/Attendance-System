-- For students table
CREATE TABLE students (
	uid VARCHAR(12) PRIMARY KEY,
	roll_no INT,
	name VARCHAR(50),
	email VARCHAR(100),
	Batch VARCHAR(20)
);

-- For attendance table
CREATE TABLE attendance (
    uid VARCHAR(12),
    time TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES students(uid)
);

-- Procedure to update and set the attendance of the user
CREATE OR REPLACE PROCEDURE add_attendance(uid_input VARCHAR(12))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO attendance (uid, time)
    VALUES (uid_input, CURRENT_TIMESTAMP);
END;
$$;