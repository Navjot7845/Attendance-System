import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log(`Yoi, someone just pinged at ${new Date()}`);
    res.json("Yoi, someone just pinged");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})