const express = require('express');
require("dotenv").config();
const aiRoutes = require("./routes/ai.routes")
const cors = require('cors')

const app = express();

app.use(cors({
    origin: '*',
}))

app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello from AI app!');
});

app.use('/ai', aiRoutes);

module.exports = app;
