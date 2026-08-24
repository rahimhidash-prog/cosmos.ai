const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

app.get("/api/status", (req, res) => {
    res.json({
        message: "COSMOS AI server is running 🚀"
    });
});

app.listen(PORT, () => {
    console.log(`COSMOS is running at http://localhost:${PORT}`);
});