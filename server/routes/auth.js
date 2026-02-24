const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtService = require('../services/jwt'); 
const multer = require('multer');
const { User, Notification } = require('../models'); 
const path = require('path');

const JWT_SECRET = 'mi_clave_super_secreta_123';

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

// RBAC
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
        }
        next();
    };
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ where: { email } });
        
        if (userExists) return res.status(400).json({ error: 'Email already registered' });

        const initialProfileData = {
            avatar: 'http://localhost:5000/uploads/default-avatar.png', // Default photo using the UPLOADS folder
            title: '',
            skills: '',
            linkedin: '',
            experience: [],
            education: [],
            projects: [],
            certs: []
        };

        const newUser = await User.create({
            name, 
            email, 
            password, 
            role: role || 'candidate',
            profileData: initialProfileData // Right here we use the photo that we put on the uploads
        });
        
        res.json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal registration error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

        const user = await User.findOne({ where: { email }});
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValid = await user.validPassword(password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwtService.generateAccessToken(user);
        const userData = user.toJSON();
        delete userData.password;

        res.header('auth-token', token).json({ success: true, token, user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE PROFILE
router.put('/update-profile', verifyToken, verifyRole('candidate', 'recruiter', 'admin'), upload.single('avatarFile'), async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, title, skills, experience, education, projects, certs, linkedin } = req.body;

        const currentUser = await User.findByPk(userId);
        const currentProfile = currentUser.profileData || {};

        let avatarUrl = currentProfile.avatar;
        if (req.file) {
            avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Pointing to port 5000 Server
        }

        const updatedProfileData = {
            title: title || currentProfile.title,
            skills: skills || currentProfile.skills,
            linkedin: linkedin || currentProfile.linkedin,
            avatar: avatarUrl,
            experience: experience ? JSON.parse(experience) : currentProfile.experience,
            education: education ? JSON.parse(education) : currentProfile.education,
            projects: projects ? JSON.parse(projects) : currentProfile.projects, 
            certs: certs ? JSON.parse(certs) : currentProfile.certs 
        };

        await User.update(
            { 
                name: name || currentUser.name, 
                profileData: updatedProfileData 
            },
            { where: { id: userId } }
        );

        const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, error: 'Update failed' });
    }
});

// CANDIDATES LIST
router.get('/candidates', verifyToken, verifyRole('recruiter', 'admin'), async (req, res) => {
    try {
        const candidates = await User.findAll({
            where: { role: 'candidate' },
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching candidates' });
    }
});

// CONTACT NOTIFICATION
router.post('/contact', verifyToken, verifyRole('recruiter', 'admin'), async (req, res) => {
    try {
        const { candidateId } = req.body;
        const recruiterName = req.user.name; // Only for recruiters and admins for the RBAC
        
        await Notification.create({
            senderName: recruiterName,
            message: `Recruiter ${recruiterName} wants to contact you!`,
            UserId: candidateId
        });
        res.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending notification' });
    }
});

// GET NOTIFICATIONS
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// ADMIN ACTIONS
router.get('/users', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Never send passwords to the frontend, verifying that this is in place
            order: [['id', 'ASC']]
        });
        res.json({ success: true, users });
    } catch (error) {
        console.error("Admin Error:", error);
        res.status(500).json({ error: 'Error fetching all users' });
    }
});

module.exports = router;