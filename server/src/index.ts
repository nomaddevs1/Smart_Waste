const express = require('express');
const dotenv = require('dotenv');


dotenv.config()
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    console.log('YAY!')
    res.send("Welcome to the world of Arduino with Node.js installed")
})

app.listen(port,'0.0.0.0', (err, res) => { 
    if (err) { 
        console.error(err)
        return;
    }
    console.log(`[server]: Server is running at http://localhost:${port}`)
})