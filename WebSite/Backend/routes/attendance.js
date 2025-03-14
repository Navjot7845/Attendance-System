import { Router } from "express";
import faceRecognition from "../face-config/pythonProcess.js";
import { db } from "../config/database.js";
import auth from "../middleware/auth.js";

const attendanceRoutes = Router();

attendanceRoutes.post('/', async (req, res) => {
  // * Extract uid from the JSON payload
  const { uid } = req.body;

  // ! If no uid given
  if (!uid) {
    console.log(`Invalid request received at ${new Date()}`);
    return res.status(400).json({ error: "UID is required" });
  }

  const result = await db.query(`SELECT * FROM students WHERE uid = $1`, [uid]);

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

attendanceRoutes.get('/attendance', async (req, res) => {
    const result = await db.query(`SELECT * FROM students`);

    console.log(result.rows);

     return res.send(result.rows);
})

export default attendanceRoutes;