import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminView() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            //console.error("Failed to fetch users (Admin):", error);
        }
    };

    return (
         <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingBottom: '100px', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(to right, #ffffff, #f8f9fa)', borderRadius: '15px', marginBottom: '40px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                <br/>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--dark)' }}>System Administration</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Overview of all registered accounts (Candidates, Recruiters, and Admins).</p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '20px', color: '#555' }}>ID</th>
                            <th style={{ padding: '20px', color: '#555' }}>Name</th>
                            <th style={{ padding: '20px', color: '#555' }}>Email Address</th>
                            <th style={{ padding: '20px', color: '#555' }}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '20px', color: '#777' }}>#{u.id}</td>
                                <td style={{ padding: '20px', fontWeight: '600' }}>{u.name}</td>
                                <td style={{ padding: '20px' }}>{u.email}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        backgroundColor: u.role === 'admin' ? '#ffebee' : u.role === 'recruiter' ? '#e3f2fd' : '#e8f5e9',
                                        color: u.role === 'admin' ? '#c62828' : u.role === 'recruiter' ? '#1565c0' : '#2e7d32'
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}