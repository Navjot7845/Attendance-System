import express from 'express';
import { spawn } from "child_process";
import ip from "ip";

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/', (req, res) => {
    const { uid } = req.body; // Extract uid from the JSON payload
    if (!uid) {
        console.log(`Invalid request received at ${new Date()}`);
        return res.status(400).json({ error: "UID is required" });
    }

    console.log(`Received UID: ${uid}`);
    console.log(`Yoi, someone just pinged at ${new Date()}`);

    const pythonProcess = spawn("python3", ["face-recognition/main.py"]);


    pythonProcess.stdout.on('data', (name) => {
        if (uid == "219c7726" && name == "Manik") {
            console.log("Verified");
        } else {
            console.log("Fake");
        }

        console.log(`stdout: ${name}`);
    });      

    // pythonProcess.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

    res.json({ message: "Yoi, someone just pinged", uid });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Network access at : http://${ipAddress}:${port}`);
});