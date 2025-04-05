import { Router } from "express";
import faceRecognition from "../face-config/pythonProcess.js";
import { db } from "../config/database.js";

const attendanceRoutes = Router();

// * This allows to get all attendance
attendanceRoutes.get("/attendance", async (req, res) => {
  try {
    console.log(req.uid);
    const result = await db.query(`
      SELECT users.uid, name, email, batch, time type FROM attendance
      LEFT JOIN users ON users.uid = attendance.uid;
      `);


    return res.status(200).send(result.rows);
  } catch (error) {
    console.error(`Server: errro while retrieving attendance ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

attendanceRoutes.post("/", async (req, res) => {
  // * Extract uid from the JSON payload
  const { uid } = req.body;

  // ! If no uid given
  if (!uid) {
    console.log(`Invalid request received at ${new Date()}`);
    return res.status(400).json({ error: "UID is required" });
  }

  const result = await db.query(
    `SELECT * FROM users WHERE uid = $1 AND type = 'student'`,
    [uid]
  );

  // * 1. Check if user id is valid
  if (result.rowCount == 0) {
    console.log(`![SERVER] : Invalid UID ${uid} was passed at ${new Date()}`);
    return res.json({ message: "Invalid user id" });
  }

  console.log(`Received UID: ${uid} at ${new Date()}`);

  // * 2. Verify using python face recognition
  faceRecognition(uid, result.rows[0].name, result.rows[0].email);

  res.json({
    message: `Status will be sent to the user through registered Email`,
  });
});

export default attendanceRoutes;
