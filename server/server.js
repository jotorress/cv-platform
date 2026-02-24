const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models'); 
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000; // Port server, different from frontend with the port 3000

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // It is for the pictures of the profile users


app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("CV-Platform API is running.");
});

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed:", err);
});