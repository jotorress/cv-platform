import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CandidateModal = React.memo(({ candidate, onClose, onContact }) => {
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const parseData = (key) => {
        const data = candidate.profileData?.[key];
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { 
            return JSON.parse(data); 
        } catch(e) { 
            return []; 
        }
    };

    const experience = parseData('experience'); // Different for education because is the recruiter view to have tree new info of the user
    const education = parseData('education');
    const projects = parseData('projects');
    const certs = parseData('certs');
    const skills = candidate.profileData?.skills ? candidate.profileData.skills.split(',') : [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content portfolio-container" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="btn-close-modal">×</button>
                
                <div style={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
                    padding: '60px 20px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #eee'
                }}>
                    <img 
                        src={candidate.profileData?.avatar || 'https://via.placeholder.com/200'} 
                        alt="Profile" 
                        style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '5px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                    />
                    <h1 style={{ fontSize: '2.2rem', margin: '15px 0 5px 0', color: '#333' }}>{candidate.name}</h1>
                    <h2 style={{ fontSize: '1.2rem', color: '#007bff', fontWeight: '400', margin: 0 }}>{candidate.profileData?.title || 'Candidate'}</h2>
                    
                    <div style={{ marginTop: '20px' }}>
                        {skills.map((s, i) => (
                            <span key={i} className="modern-skill-tag" style={{ margin: '5px', fontSize: '0.9rem' }}>{s.trim()}</span>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        {candidate.profileData?.linkedin && (
                            <a href={candidate.profileData.linkedin} target="_blank" rel="noreferrer" className="btn" style={{ background: '#0077b5', color: 'white' }}>
                                LinkedIn Profile
                            </a>
                        )}
                        <button onClick={() => onContact(candidate.id)} className="btn" style={{ background: '#212529', color: 'white' }}>
                            👋 Contact Candidate
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    
                    {experience.length > 0 && (
                        <div className="modal-section">
                            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Work Experience</h2>
                            {experience.map((exp) => (
                                <div key={exp.id} className="item-card" style={{ borderLeft: '4px solid #007bff', padding: '25px' }}>
                                    <div className="item-header">
                                        <span className="item-role" style={{ fontSize: '1.3rem' }}>{exp.role}</span>
                                        <span className="item-org" style={{ fontSize: '1rem' }}>{exp.company}</span>
                                    </div>
                                    <p className="item-desc" style={{ fontSize: '1rem', lineHeight: '1.7' }}>{exp.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="modal-section">
                            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>Featured Projects</h2>
                            <div className="projects-grid">
                                {projects.map((proj) => (
                                    <div key={proj.id} className="project-card">
                                        <div style={{ height: '140px', background: 'linear-gradient(45deg, #007bff, #6610f2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem' }}>🚀</div>
                                        <div className="project-body">
                                            <h4 className="project-title" style={{ fontSize: '1.2rem' }}>{proj.name}</h4>
                                            <p style={{ color: '#666' }}>{proj.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {education.length > 0 && (
                            <div>
                                <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block', marginBottom: '20px' }}>🎓 Education</h3>
                                {education.map((edu) => (
                                    <div key={edu.id} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>{edu.degree}</strong>
                                        <span style={{ color: '#555' }}>{edu.school} • {edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {certs.length > 0 && (
                            <div>
                                <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block', marginBottom: '20px' }}>🏅 Certificates</h3>
                                {certs.map((cer) => (
                                    <div key={cer.id} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>{cer.name}</strong>
                                        <span style={{ color: '#555' }}>{cer.issuer} • {cer.year}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function RecruiterView() {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await api.get('/auth/candidates');
            if (response.data.success) {
                setCandidates(response.data.candidates);
            }
        } catch (error) { 
            console.error("Failed to fetch candidates:", error); 
        }
    };

    const handleContact = async (candidateId) => {
        try {
            await api.post('/auth/contact', { candidateId });
            alert('Interest notification sent successfully!');
        } catch (error) { 
            console.error("Failed to send notification:", error); 
        }
    };

    const filteredCandidates = candidates.filter(c => {
        const titleMatch = c.profileData?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const skillsMatch = c.profileData?.skills?.toLowerCase().includes(searchTerm.toLowerCase());
        const nameMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return nameMatch || titleMatch || skillsMatch;
    });

    return (
        <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingBottom: '100px', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(to right, #ffffff, #f8f9fa)', borderRadius: '15px', marginBottom: '40px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--dark)' }}>Talent Discovery</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Search for developers, designers, and professionals.</p>
                
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="Search by skill, name, or title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', 
                            padding: '18px 25px', 
                            borderRadius: '50px', 
                            border: '1px solid #ddd', 
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
                        }}
                    />
                    <span style={{ position: 'absolute', right: '25px', top: '18px', fontSize: '1.2rem', opacity: 0.5 }}>🔍</span>
                </div>
            </div>

            <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px', marginBottom: '50px' }}>
                {filteredCandidates.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className="item-card candidate-card-hover" 
                        onClick={() => setSelectedCandidate(candidate)}
                        style={{
                            padding: '30px', 
                            textAlign: 'center', 
                            borderLeft: 'none', 
                            borderTop: '4px solid var(--primary)', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between', 
                            height: '100%',
                            minHeight: '320px'
                        }}
                    >
                        <div>
                            <img src={candidate.profileData?.avatar || 'https://via.placeholder.com/100'} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: '3px solid #f8f9fa' }}/>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{candidate.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: '600', margin: '0 0 15px 0' }}>{candidate.profileData?.title || 'Candidate'}</p>
                            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666', height: '42px', overflow: 'hidden', lineHeight: '1.4' }}>
                                {candidate.profileData?.skills ? candidate.profileData.skills.split(',').slice(0, 3).join(', ') : 'No skills listed'}
                            </div>
                        </div>
                        <button className="btn" style={{ background: '#e3f2fd', color: 'var(--primary)', width: '100%', fontWeight: 'bold' }}>View Profile</button>
                    </div>
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
                    <h3>No candidates found.</h3>
                </div>
            )}

            {selectedCandidate && (
                <CandidateModal 
                    candidate={selectedCandidate} 
                    onClose={() => setSelectedCandidate(null)} 
                    onContact={handleContact}
                />
            )}
        </div>
    );
}