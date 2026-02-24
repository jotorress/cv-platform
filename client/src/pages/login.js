import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post('/auth/login', form);
            
            localStorage.setItem('token', response.data.token); // We save the token in the localstorage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            navigate('/dashboard');

        } catch (error) {
            console.error("Login Error:", error);
            setError(error.response?.data?.error || 'Invalid credentials or connection error.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Sign In</h2>
            
            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email</label>
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

                <button type="submit" className="btn-login">Sign In</button>
            </form>

            <p className="register-text">
                Don't have an account? <Link to="/register" className="register-link">Sign up here</Link>
            </p>
        </div>
    );
}