import express from "express";
import ip from "ip";
import { ConnectToPostgres } from "./config/database.js";
import attendanceRoutes from "./routes/attendance.js";
import connectToMongoDB from "./db/database.js";
import userRoutes from "./routes/user.js";

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

ConnectToPostgres();
connectToMongoDB();

//*  Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * To check if system is up
app.get("/", (req, res) => {
  res.send("<h1>Attendance system is up and running 😎</h1>");
});

app.use('/', attendanceRoutes);
app.use('/user', userRoutes);

app.post("/update", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
  console.log(`Network access at : http://${ipAddress}:${port}\n\n`);
});
