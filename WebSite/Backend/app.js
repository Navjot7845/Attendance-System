import express from "express";
import ip from "ip";
import faceRecognition from "./face-config/pythonProcess.js";
import { connectDB, db } from "./config/database.js";

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

connectDB();

//*  Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * To check if system is up
app.get("/", (req, res) => {
  res.send("<h1>Attendance system is up and running 😎</h1>");
});

// * To get the request to update attendance
app.post("/", async (req, res) => {
  // * Extract uid from the JSON payload
  const { uid } = req.body;

  // ! If no uid given
  if (!uid) {
    console.log(`Invalid request received at ${new Date()}`);
    return res.status(400).json({ error: "UID is required" });
  }

  const result = await db.query(`SELECT * FROM students WHERE uid = $1`,[uid]);

  // * 1. Check if user id is valid
  if (result.rowCount == 0) {
    console.log(`![SERVER] : Invalid UID ${uid} was passed at ${new Date()}`);
    res.json({ message: "Invalid user id" });
  }

  console.log(`Received UID: ${uid} at ${new Date()}`);

  // * 2. Verify using python face recognition
  faceRecognition(uid);

  res.json({
    message: `Status will be sent to the user through registered Email`,
  });
});

app.post("/update", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
  console.log(`Network access at : http://${ipAddress}:${port}\n\n`);
});
