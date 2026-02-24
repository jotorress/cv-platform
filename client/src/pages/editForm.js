import React, { useState } from 'react';

export default function EditForm({ user, type, onSave, onCancel }) {
    
    const parseList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string' && data.length > 2) {
            try { 
                return JSON.parse(data);
            } catch(e) { 
                return []; 
            }
        }
        return [];
    };

    const [formData, setFormData] = useState({
        name: user.name || '', // All the data about the user are here, we are trying to get with the Forms
        linkedin: user.profileData?.linkedin || '',
        title: user.profileData?.title || '',
        skills: user.profileData?.skills || '',
        experience: parseList(user.profileData?.experience),
        education: parseList(user.profileData?.education),
        projects: parseList(user.profileData?.projects),
        certs: parseList(user.profileData?.certs),
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(user.profileData?.avatar || null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const addItem = (listName, template) => {
        setFormData({ ...formData, [listName]: [...formData[listName], { ...template, id: Date.now() }] });
    };

    const removeItem = (listName, id) => {
        setFormData({ ...formData, [listName]: formData[listName].filter(item => item.id !== id) });
    };

    const updateItem = (listName, id, field, value) => {
        const newList = formData[listName].map(item => item.id === id ? { ...item, [field]: value } : item);
        setFormData({ ...formData, [listName]: newList });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, avatarFile: selectedFile });
    };

    return (
        <div className="edit-container">
            <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                {type === 'account' ? 'Personal Settings' : 'Portfolio Content'}
            </h2>
            <form onSubmit={handleSubmit}>
                
                {type === 'account' ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img src={preview || 'https://via.placeholder.com/150'} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ddd' }} alt="Profile"/>
                            <br/>
                            <label className="btn" style={{ background: '#eee', color: '#333', marginTop: '10px', display: 'inline-block', cursor: 'pointer' }}>
                                📷 Upload Photo <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                        <label className="form-label">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="form-input" />
                        
                        <label className="form-label">LinkedIn / URL</label>
                        <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-input" />
                    </>
                ) : (
                    <>
                        <label className="form-label">Main Professional Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Fullstack Developer" />
                        
                        <label className="form-label">Skills (comma separated)</label>
                        <textarea name="skills" value={formData.skills} onChange={handleChange} className="form-textarea" rows="2" />

                        <div className="dynamic-section">
                            <h3>💼 Work Experience</h3>
                            {formData.experience.map((item) => (
                                <div key={item.id} className="item-card" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px' }}>
                                    <input placeholder="Role" value={item.role} onChange={e => updateItem('experience', item.id, 'role', e.target.value)} className="form-input"/>
                                    <input placeholder="Company" value={item.company} onChange={e => updateItem('experience', item.id, 'company', e.target.value)} className="form-input"/>
                                    <textarea placeholder="Description" value={item.desc} onChange={e => updateItem('experience', item.id, 'desc', e.target.value)} className="form-textarea"/>
                                    <button type="button" onClick={() => removeItem('experience', item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addItem('experience', { role: '', company: '', desc: '' })} className="btn" style={{ background: '#e3f2fd', color: '#007bff' }}>+ Add Job</button>
                        </div>

                        <div className="dynamic-section">
                            <h3>🎓 Education</h3>
                            {formData.education.map((item) => (
                                <div key={item.id} className="item-card" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px' }}>
                                    <input placeholder="Degree / Career" value={item.degree} onChange={e => updateItem('education', item.id, 'degree', e.target.value)} className="form-input"/>
                                    <input placeholder="University / School" value={item.school} onChange={e => updateItem('education', item.id, 'school', e.target.value)} className="form-input"/>
                                    <input placeholder="Year (e.g. 2024-2026)" value={item.year} onChange={e => updateItem('education', item.id, 'year', e.target.value)} className="form-input"/>
                                    <button type="button" onClick={() => removeItem('education', item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addItem('education', { degree: '', school: '', year: '' })} className="btn" style={{ background: '#e3f2fd', color: '#007bff' }}>+ Add Education</button>
                        </div>

                        <div className="dynamic-section">
                            <h3>🚀 Projects</h3>
                            {formData.projects.map((item) => (
                                <div key={item.id} className="item-card" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px' }}>
                                    <input placeholder="Project Name" value={item.name} onChange={e => updateItem('projects', item.id, 'name', e.target.value)} className="form-input"/>
                                    <textarea placeholder="What did you build?" value={item.desc} onChange={e => updateItem('projects', item.id, 'desc', e.target.value)} className="form-textarea"/>
                                    <button type="button" onClick={() => removeItem('projects', item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addItem('projects', { name: '', desc: '' })} className="btn" style={{ background: '#e3f2fd', color: '#007bff' }}>+ Add Project</button>
                        </div>
                    </>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button type="submit" className="btn btn-save" style={{ width: '100%' }}>Save All Changes</button>
                    <button type="button" onClick={onCancel} className="btn btn-cancel" style={{ marginTop: '10px', width: '100%' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}