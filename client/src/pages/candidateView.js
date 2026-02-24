import React, { useEffect, useRef } from 'react';

const RevealSection = ({ children, className }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current.classList.add('visible');
                }
            },
            { threshold: 0.1 }
        );
        
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} className={`portfolio-section ${className || ''}`}>
            {children}
        </div>
    );
};

export default function CandidateView({ user, onEditWork }) {
    const parseData = (key) => {
        const data = user.profileData?.[key]; // Analyzing profile data
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { 
            return JSON.parse(data); 
        } catch(e) { 
            return []; 
        }
    };

    const experience = parseData('experience'); // Different for education to have tree new info of the user
    const education = parseData('education');
    const projects = parseData('projects');
    const skills = user.profileData?.skills ? user.profileData.skills.split(',') : [];

    return (
        <div className="portfolio-container">
            
            <div className="hero-section">
                <div className="hero-content">
                    <img src={user.profileData?.avatar || 'https://via.placeholder.com/200'} alt="Profile" />
                    <h1 className="hero-name">{user.name}</h1>
                    <h2 className="hero-title">{user.profileData?.title || 'Aspiring Professional'}</h2>
                    
                    <div style={{ marginTop: '20px' }}>
                         {skills.map((s, i) => (
                             <span key={i} className="modern-skill-tag" style={{ margin: '5px', display: 'inline-block' }}>
                                 {s.trim()}
                             </span>
                         ))}
                    </div>
                    
                    {user.profileData?.linkedin && (
                        <a href={user.profileData.linkedin} target="_blank" rel="noreferrer" className="btn" style={{ marginTop: '30px', display: 'inline-block', background: 'var(--dark)', color: 'white' }}>
                            Contact Me
                        </a>
                    )}
                </div>
                <div className="hero-scroll-btn">⌄</div>
            </div>

            <RevealSection>
                <h2 className="section-title">Education</h2>
                {education.length > 0 ? education.map((edu) => (
                    <div key={edu.id} className="item-card">
                        <div className="item-header">
                            <span className="item-role">{edu.degree}</span>
                            <span className="item-org">{edu.year}</span>
                        </div>
                        <div className="item-desc">{edu.school}</div>
                    </div>
                )) : <p style={{ textAlign: 'center', color: '#999' }}>No education info yet.</p>}
            </RevealSection>

            <RevealSection>
                <h2 className="section-title">Work Experience</h2>
                {experience.length > 0 ? experience.map((exp) => (
                    <div key={exp.id} className="item-card">
                        <div className="item-header">
                            <span className="item-role">{exp.role}</span>
                            <span className="item-org">{exp.company}</span>
                        </div>
                        <p className="item-desc">{exp.desc}</p>
                    </div>
                )) : <p style={{ textAlign: 'center', color: '#999' }}>No work experience yet.</p>}
            </RevealSection>

            <RevealSection>
                <h2 className="section-title">Featured Projects</h2>
                <div className="projects-grid">
                    {projects.length > 0 ? projects.map((proj) => (
                        <div key={proj.id} className="project-card">
                            <div style={{ height: '150px', background: 'linear-gradient(45deg, #007bff, #6610f2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>
                                🚀
                            </div>
                            <div className="project-body">
                                <h4 className="project-title">{proj.name}</h4>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{proj.desc}</p>
                            </div>
                        </div>
                    )) : <p style={{ textAlign: 'center', color: '#999', width: '100%' }}>No projects added.</p>}
                </div>
            </RevealSection>

            <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', marginTop: '50px' }}>
                <p>© 2026 {user.name} - Professional Portfolio</p>
            </div>

            <button onClick={onEditWork} className="btn-edit-float" title="Edit Portfolio">✎</button>
        </div>
    );
}