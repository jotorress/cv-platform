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

db.sequelize.sync({ force: false }).then(async() => { // False to avoid losing data when the server restarts, if we put true, it is to reset the database on each start
    try {
        const userCount = await db.User.count();
        if (userCount === 0) {
            console.log("No users found. Creating default testing accounts...");
            await db.User.bulkCreate([
                {
                    name: "Admin Test",
                    email: "admin@test.com",
                    password: "password123",
                    role: "admin",
                    profileData: { avatar: "http://localhost:5000/uploads/default-avatar.png", title: "System Administrator" }
                },
                {
                    name: "Recruiter Test",
                    email: "recruiter@test.com",
                    password: "password123",
                    role: "recruiter",
                    profileData: { avatar: "http://localhost:5000/uploads/default-avatar.png", title: "Tech Recruiter" }
                },
                {
                    name: "Candidate Test",
                    email: "candidate@test.com",
                    password: "password123",
                    role: "candidate",
                    profileData: { avatar: "http://localhost:5000/uploads/default-avatar.png", title: "Software Engineer" }
                }
            ], { individualHooks: true }); // Encrypt passwords with hooks bcrypt
            console.log("Default users created successfully!");
        }
    } catch (error) {
        console.error("Error creating default users:", error);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed:", err);
});