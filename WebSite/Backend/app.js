import express from 'express';
import ip from "ip";

const app = express();
const port = 3000;
const ipAddress = ip.address();

// Middleware to parse JSON payloads
app.use(express.json());

app.post('/', (req, res) => {
    const { uid } = req.body; // Extract uid from the JSON payload
    if (!uid) {
        console.log(`Invalid request received at ${new Date()}`);
        return res.status(400).json({ error: "UID is required" });
    }

    console.log(`Received UID: ${uid}`);
    console.log(`Yoi, someone just pinged at ${new Date()}`);
    res.json({ message: "Yoi, someone just pinged", uid });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Network access at : http://${ipAddress}:${port}`);
});