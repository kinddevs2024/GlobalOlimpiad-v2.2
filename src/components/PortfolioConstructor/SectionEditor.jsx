import { useState, useEffect } from "react";
import CertificateUploader from "./CertificateUploader";
import ImageUpload from "./ImageUpload";

const SectionEditor = ({ section, onUpdate, onClose }) => {
  const [title, setTitle] = useState(section.title || "");
  const [content, setContent] = useState(section.content || {});

  useEffect(() => {
    setTitle(section.title || "");
    setContent(section.content || {});
  }, [section]);

  const handleSave = () => {
    onUpdate({
      title,
      content,
    });
    onClose();
  };

  const renderEditor = () => {
    switch (section.type) {
      case "about":
        return (
          <div className="form-group">
            <label>About Text</label>
            <textarea
              value={content.text || content.bio || ""}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
              rows={6}
              placeholder="Tell your story..."
            />
          </div>
        );

      case "skills":
        return (
          <div className="form-group">
            <label>Skills (one per line)</label>
            <textarea
              value={(content.skills || content.items || []).join("\n")}
              onChange={(e) => {
                const skills = e.target.value
                  .split("\n")
                  .filter((s) => s.trim().length > 0);
                setContent({ ...content, skills });
              }}
              rows={6}
              placeholder="JavaScript&#10;React&#10;Python"
            />
          </div>
        );

      case "achievements":
        return (
          <div className="achievements-editor">
            <label>Achievements</label>
            {(content.achievements || content.items || []).map((achievement, index) => (
              <div key={index} className="achievement-item-editor" style={{
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: 'var(--bg-secondary)',
              }}>
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={achievement.title || achievement.name || ""}
                  onChange={(e) => {
                    const achievements = [...(content.achievements || content.items || [])];
                    achievements[index] = { ...achievements[index], title: e.target.value };
                    setContent({ ...content, achievements });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                />
                <textarea
                  placeholder="Description"
                  value={achievement.description || ""}
                  onChange={(e) => {
                    const achievements = [...(content.achievements || content.items || [])];
                    achievements[index] = { ...achievements[index], description: e.target.value };
                    setContent({ ...content, achievements });
                  }}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                />
                <div style={{ marginBottom: '0.5rem' }}>
                  <ImageUpload
                    label="Achievement Image/Certificate"
                    value={achievement.image || achievement.certificateUrl || ""}
                    onChange={(url) => {
                      const achievements = [...(content.achievements || content.items || [])];
                      achievements[index] = { ...achievements[index], image: url, certificateUrl: url };
                      setContent({ ...content, achievements });
                    }}
                    recommendedSize="800x600"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Organization"
                  value={achievement.organization || ""}
                  onChange={(e) => {
                    const achievements = [...(content.achievements || content.items || [])];
                    achievements[index] = { ...achievements[index], organization: e.target.value };
                    setContent({ ...content, achievements });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={achievement.year || ""}
                  onChange={(e) => {
                    const achievements = [...(content.achievements || content.items || [])];
                    achievements[index] = { ...achievements[index], year: e.target.value };
                    setContent({ ...content, achievements });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                />
                <button
                  onClick={() => {
                    const achievements = (content.achievements || content.items || []).filter(
                      (_, i) => i !== index
                    );
                    setContent({ ...content, achievements });
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const achievements = [...(content.achievements || content.items || []), {}];
                setContent({ ...content, achievements });
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Add Achievement
            </button>
          </div>
        );

      case "projects":
        return (
          <div className="projects-editor">
            <label>Projects</label>
            {(content.projects || content.items || []).map((project, index) => (
              <div key={index} className="project-item-editor">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title || ""}
                  onChange={(e) => {
                    const projects = [...(content.projects || content.items || [])];
                    projects[index] = { ...projects[index], title: e.target.value };
                    setContent({ ...content, projects });
                  }}
                />
                <textarea
                  placeholder="Description"
                  value={project.description || ""}
                  onChange={(e) => {
                    const projects = [...(content.projects || content.items || [])];
                    projects[index] = { ...projects[index], description: e.target.value };
                    setContent({ ...content, projects });
                  }}
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  value={project.link || project.links?.live || ""}
                  onChange={(e) => {
                    const projects = [...(content.projects || content.items || [])];
                    projects[index] = {
                      ...projects[index],
                      link: e.target.value,
                      links: { ...projects[index].links, live: e.target.value },
                    };
                    setContent({ ...content, projects });
                  }}
                />
                <div style={{ marginTop: "0.5rem" }}>
                  <ImageUpload
                    label="Project Image"
                    value={project.image || ""}
                    onChange={(url) => {
                      const projects = [...(content.projects || content.items || [])];
                      projects[index] = { ...projects[index], image: url };
                      setContent({ ...content, projects });
                    }}
                    recommendedSize="800x600"
                  />
                </div>
                <button
                  onClick={() => {
                    const projects = (content.projects || content.items || []).filter(
                      (_, i) => i !== index
                    );
                    setContent({ ...content, projects });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const projects = [...(content.projects || content.items || []), {}];
                setContent({ ...content, projects });
              }}
            >
              + Add Project
            </button>
          </div>
        );

      case "certificates":
        return (
          <CertificateUploader
            certificates={content.certificates || content.items || []}
            onUpdate={(certificates) => setContent({ ...content, certificates })}
          />
        );

      case "interests":
        return (
          <div className="form-group">
            <label>Interests (one per line)</label>
            <textarea
              value={(content.interests || content.items || []).join("\n")}
              onChange={(e) => {
                const interests = e.target.value
                  .split("\n")
                  .filter((s) => s.trim().length > 0);
                setContent({ ...content, interests });
              }}
              rows={6}
              placeholder="Reading&#10;Music&#10;Sports"
            />
          </div>
        );

      case "education":
        return (
          <div className="education-editor">
            <label>Education</label>
            {(content.education || content.items || []).map((edu, index) => (
              <div key={index} className="education-item-editor">
                <input
                  type="text"
                  placeholder="Degree/Title"
                  value={edu.degree || edu.title || ""}
                  onChange={(e) => {
                    const education = [...(content.education || content.items || [])];
                    education[index] = { ...education[index], degree: e.target.value };
                    setContent({ ...content, education });
                  }}
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution || edu.school || edu.university || ""}
                  onChange={(e) => {
                    const education = [...(content.education || content.items || [])];
                    education[index] = { ...education[index], institution: e.target.value };
                    setContent({ ...content, education });
                  }}
                />
                <input
                  type="text"
                  placeholder="Period (e.g., 2020-2024)"
                  value={edu.period || ""}
                  onChange={(e) => {
                    const education = [...(content.education || content.items || [])];
                    education[index] = { ...education[index], period: e.target.value };
                    setContent({ ...content, education });
                  }}
                />
                <button
                  onClick={() => {
                    const education = (content.education || content.items || []).filter(
                      (_, i) => i !== index
                    );
                    setContent({ ...content, education });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const education = [...(content.education || content.items || []), {}];
                setContent({ ...content, education });
              }}
            >
              + Add Education
            </button>
          </div>
        );

      case "custom":
        return (
          <div className="form-group">
            <label>Custom Content</label>
            <textarea
              value={content.content || content.text || content.html || ""}
              onChange={(e) => setContent({ ...content, content: e.target.value })}
              rows={8}
              placeholder="Enter custom content..."
            />
          </div>
        );

      default:
        return <p>No editor available for this section type.</p>;
    }
  };

  return (
    <div className="section-editor">
      <div className="editor-header">
        <h4>Edit Section: {section.type}</h4>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="form-group">
        <label>Section Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section Title"
        />
      </div>
      {renderEditor()}
      <div className="editor-actions">
        <button className="button-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="button-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;


