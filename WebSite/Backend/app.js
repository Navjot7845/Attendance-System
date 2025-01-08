import express from "express";
import ip from "ip";
import faceRecognition from "./config/pythonProcess.js";

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

//*  Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const { uid } = req.body; // * Extract uid from the JSON payload
  
  if (!uid) {
    console.log(`Invalid request received at ${new Date()}`);
    return res.status(400).json({ error: "UID is required" });
  }

  console.log(`Received UID: ${uid}`);
  console.log(`Yoi, someone just pinged at ${new Date()}`);

  // ! Code to run the python face recognition program
  faceRecognition(uid);

  res.json({ message: "Yoi, someone just pinged", uid });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
  console.log(`Network access at : http://${ipAddress}:${port}`);
});
