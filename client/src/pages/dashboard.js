import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

import CandidateView from './candidateView';
import RecruiterView from './recruiterView';
import AdminView from './adminView';
import EditForm from './editForm';
import api from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'settings', or 'work'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!token || !storedUser) { // We're checking right now the token in the Dashboard
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSave = async (formDataObj) => {       
        const dataToSend = new FormData();
        
        dataToSend.append('name', formDataObj.name);
        dataToSend.append('linkedin', formDataObj.linkedin || '');
        dataToSend.append('title', formDataObj.title || '');
        dataToSend.append('skills', formDataObj.skills || '');

        dataToSend.append('experience', JSON.stringify(formDataObj.experience || []));
        dataToSend.append('education', JSON.stringify(formDataObj.education || [])); 
        dataToSend.append('projects', JSON.stringify(formDataObj.projects || []));   
        dataToSend.append('certs', JSON.stringify(formDataObj.certs || []));         

        if (formDataObj.avatarFile) {
            dataToSend.append('avatarFile', formDataObj.avatarFile); // This is the picture for every user profile
        }

        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/auth/update-profile', dataToSend, {
                headers: {
                    'auth-token': token
                }
            });
            
            const data = response.data;

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                setActiveView('dashboard'); 
                alert("Profile saved successfully!");
            } else {
                alert(data.error || "Update failed. Please try again.");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Server connection error. Please check the console.");
        }
    };

    if (!user) return <div className="dashboard-container">Loading...</div>;

    const renderContent = () => {
        if (activeView === 'settings') {
            return (
                <EditForm 
                    user={user} 
                    type="account" 
                    onSave={handleSave} 
                    onCancel={() => setActiveView('dashboard')} 
                />
            );
        }
        
        if (activeView === 'work') {
            return (
                <EditForm 
                    user={user} 
                    type="work" 
                    onSave={handleSave} 
                    onCancel={() => setActiveView('dashboard')} 
                />
            );
        }

        if (user.role === 'admin') {
            return <AdminView />;
        } else if (user.role === 'recruiter') {
            return <RecruiterView user={user} />;
        } else {
            return <CandidateView user={user} onEditWork={() => setActiveView('work')} />;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
                        src={user.profileData?.avatar || 'https://via.placeholder.com/50'} 
                        alt="User avatar" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div className="header-title">
                        <h1>{user.name}</h1>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </div>
                </div>
                
                <div className="header-actions">
                    {activeView === 'dashboard' && (
                        <button 
                            onClick={() => setActiveView('settings')} 
                            className="btn btn-settings"
                            style={{ marginRight: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                        >
                            ⚙️ Settings
                        </button>
                    )}
                    <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </div>
            </header>
            {renderContent()}
        </div>
    );
}