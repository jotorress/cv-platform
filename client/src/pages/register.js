import React, { useState } from 'react';
import api from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';
import './register.css';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'candidate' 
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await api.post('/auth/register', form);
            alert("Registration successful! Please sign in.");
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.response?.data?.error || 'Failed to register. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Create Account</h2>
            
            {error && <div className="register-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">I am a:</label>
                    <select 
                        name="role" 
                        value={form.role} 
                        onChange={handleChange} 
                        className="form-input"
                    >
                        <option value="candidate">Candidate (Looking for a job)</option>
                        <option value="recruiter">Recruiter (Looking for talent)</option>
                    </select>
                </div>

                <button type="submit" className="btn-register">Sign Up</button>
            </form>

            <p className="login-text">
                Already have an account? <Link to="/login" className="login-link">Sign in here</Link>
            </p>
        </div>
    );
}