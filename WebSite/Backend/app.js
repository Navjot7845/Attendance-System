import express from 'express';
import ip from "ip";

const app = express();
const port = process.env.PORT || 3000;
const ipAddress = ip.address();

app.get('/', (req, res) => {
    console.log(`Yoi, someone just pinged at ${new Date()}`);
    res.json("Yoi, someone just pinged");
})

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Network access at : http://${ipAddress}:${port}`);
})