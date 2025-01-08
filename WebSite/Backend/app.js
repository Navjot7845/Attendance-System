import express from 'express';
import { spawn } from "child_process";
import ip from "ip";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    const { uid } = req.body; // Extract uid from the JSON payload
    if (!uid) {
        console.log(`Invalid request received at ${new Date()}`);
        return res.status(400).json({ error: "UID is required" });
    }

    console.log(`Received UID: ${uid}`);
    console.log(`Yoi, someone just pinged at ${new Date()}`);

    // ! Code to run the python face recognition program
    const pythonProcess = spawn("python3", [`${__dirname}/face-recognition/main.py`]);

    // * This runs when we start the verification of the user
    pythonProcess.stdout.on('data', (data) => {
        const name = data.toString().trim(); 
        if (uid === "219c7726" && name === "Manik") {
            console.log("Verified");
        } else {
            // TODO 1 Check if no face
            // TODO 2 Check if not verified
            // TODO 3 Try to catch all the errors
            console.log("Fake");
        }

        console.log(`Name of the person : ${name}`);
    });

    // ? This below is to check for errors
    // pythonProcess.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

    res.json({ message: "Yoi, someone just pinged", uid });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Network access at : http://${ipAddress}:${port}`);
});
