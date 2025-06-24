const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const analyzeRoute = require("./routes/analyze.js");
const authRoutes = require('./routes/auth');

app.use("/api/analyze-idea", analyzeRoute);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
