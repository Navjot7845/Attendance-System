import pg from "pg";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// * Client object created to connect to the database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// * Connecting to the PostgreSQL database
async function ConnectToPostgres() {
  try {
    await db.connect();

    console.log("Connected to the PG database");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}

async function generateOTP(email) {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const result = await db.query(
    "INSERT INTO otps (email, otp) VALUES ($1, $2) RETURNING *",
    [email, otp]
  );

  console.log(`Otp saved to the Postgres database ${result.rows[0].otp}`);

  return result.rows.length > 0 ? result.rows[0].otp : null;
}

// * Find OTP for a user by email
async function findOTP(email) {
  try {
    const result = await db.query(
      "SELECT * FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1;",
      [email]
    );

    const otp = result.rows[0]?.otp || null;
    console.log(otp);

    return otp;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return null;
  }
}

// * Delete OTP for a user by email
async function deleteOTP(email) {
  await db.query("DELETE FROM otps WHERE email = $1", [email]);
}

// * Create a new user
async function createUser(uid, roll_no, name, email, batch, password, token) {
    const result = await db.query(
      `INSERT INTO users 
      (uid, roll_no, name, email, batch, password, token) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING uid, name, email, batch, roll_no, type`, // No parentheses around returning columns
      [uid, roll_no, name, email, batch, password, token]
    );
  
    return result.rows[0];
  }

// * Find a user by email and password
async function findUserByCredentials(email, password) {
    try {
        // * 1. Find user by email
        const userResult = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // * 2. Check if user exists
        if (userResult.rows.length === 0) {
            throw new Error("Invalid credentials");
        }

        const user = userResult.rows[0];
        const uid = user.uid;

        // * 3. Verify password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ uid }, process.env.ENCRYPTION_SECRET);

        const response = await db.query("UPDATE users SET token = $1 WHERE email = $2 RETURNING *",
            [token, email]
        )

        // * 4. Return user without sensitive data
        return {
            uid: response.rows[0].uid,
            name: response.rows[0].name,
            email: response.rows[0].email,
            batch: response.rows[0].batch,
            roll_no: response.rows[0].roll_no,
            type: response.rows[0].type,
            token: response.rows[0].token
        };

    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Invalid credentials");
    }
}

// * Find a user by ID
async function findUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

// * Save password reset code for a user
async function saveResetCode(email, code) {
  await db.query("INSERT INTO password_resets (email, code) VALUES ($1, $2)", [
    email,
    code,
  ]);
}

// * Find password reset code
async function findResetCode(code) {
  const result = await db.query(
    "SELECT * FROM password_resets WHERE code = $1",
    [code]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

// * Delete password reset code after use
async function deleteResetCode(code) {
  await db.query("DELETE FROM password_resets WHERE code = $1", [code]);
}

// * Update user password
async function updateUserPassword(email, newPassword) {
  await db.query("UPDATE users SET password = $1 WHERE email = $2", [
    newPassword,
    email,
  ]);
}

export {
  ConnectToPostgres,
  db,
  findOTP,
  deleteOTP,
  createUser,
  findUserByCredentials,
  findUserById,
  saveResetCode,
  findResetCode,
  deleteResetCode,
  updateUserPassword,
  generateOTP,
};
