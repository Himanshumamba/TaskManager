const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require('./db');

// Load environment variables from .env file
require('dotenv').config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the .env file');
    process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
