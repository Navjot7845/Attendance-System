import pg from "pg";

// * Client object created to connect to the database
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

// * Returning connectDB function to connect to `postgres database`
async function connectDB() {
    await db.connect((err) => {
        if (err) {
            console.error('Connection error', err.stack);
        } else {
            console.log('Connected to the database');
        }
    });
}

export { connectDB, db };

// ! Sample code below to query 
// db.query("SELECT * FROM students", (err, res) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(res.rows);
//     }

//     db.end();
// })