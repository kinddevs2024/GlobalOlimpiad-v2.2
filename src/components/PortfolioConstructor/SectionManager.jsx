import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SectionEditor from "./SectionEditor";
import CertificateUploader from "./CertificateUploader";

const SECTION_TYPES = [
  { value: "about", label: "About" },
  { value: "skills", label: "Skills" },
  { value: "achievements", label: "Achievements" },
  { value: "projects", label: "Projects" },
  { value: "certificates", label: "Certificates" },
  { value: "interests", label: "Interests" },
  { value: "education", label: "Education" },
  { value: "custom", label: "Custom" },
];

const SectionManager = ({ sections, hero, onChange }) => {
  const [editingSection, setEditingSection] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    onChange(updatedSections, hero);
  };

  const handleAddSection = (type) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: sections.length,
      title: SECTION_TYPES.find((t) => t.value === type)?.label || type,
      content: getDefaultContent(type),
      style: {},
    };

    onChange([...sections, newSection], hero);
    setEditingSection(newSection.id);
  };

  const handleUpdateSection = (sectionId, updates) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    onChange(updatedSections, hero);
  };

  const handleDeleteSection = (sectionId) => {
    const updatedSections = sections.filter((section) => section.id !== sectionId);
    onChange(updatedSections, hero);
    if (editingSection === sectionId) {
      setEditingSection(null);
    }
  };

  const handleToggleSection = (sectionId) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    );
    onChange(updatedSections, hero);
  };

  const handleHeroUpdate = (heroUpdates) => {
    onChange(sections, { ...hero, ...heroUpdates });
  };

  const getDefaultContent = (type) => {
    const defaults = {
      about: { text: "" },
      skills: { skills: [] },
      achievements: { achievements: [] },
      projects: { projects: [] },
      certificates: { certificates: [] },
      interests: { interests: [] },
      education: { education: [] },
      custom: { content: "" },
    };
    return defaults[type] || {};
  };

  return (
    <div className="section-manager">
      <div className="section-manager-header">
        <h3>Section Management</h3>
        <p className="section-description">
          Add, reorder, and edit portfolio sections. Drag sections to reorder.
        </p>
      </div>

      <div className="hero-editor">
        <h4>Hero Section</h4>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={hero?.title || ""}
            onChange={(e) => handleHeroUpdate({ title: e.target.value })}
            placeholder="Welcome to My Portfolio"
          />
        </div>
        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={hero?.subtitle || ""}
            onChange={(e) => handleHeroUpdate({ subtitle: e.target.value })}
            placeholder="Student & Olympiad Participant"
          />
        </div>
        <div className="form-group">
          <label>Hero Image URL</label>
          <input
            type="text"
            value={hero?.image || ""}
            onChange={(e) => handleHeroUpdate({ image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="form-group">
          <label>CTA Text</label>
          <input
            type="text"
            value={hero?.ctaText || ""}
            onChange={(e) => handleHeroUpdate({ ctaText: e.target.value })}
            placeholder="Get Started"
          />
        </div>
        <div className="form-group">
          <label>CTA Link</label>
          <input
            type="text"
            value={hero?.ctaLink || ""}
            onChange={(e) => handleHeroUpdate({ ctaLink: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="sections-list">
        <h4>Sections</h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`section-item ${!section.enabled ? "disabled" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
                      >
                        <div className="section-item-header">
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                          >
                            ☰
                          </div>
                          <div className="section-item-info">
                            <span className="section-item-title">
                              {section.title}
                            </span>
                            <span className="section-item-type">{section.type}</span>
                          </div>
                          <div className="section-item-actions">
                            <button
                              className="icon-button"
                              onClick={() => handleToggleSection(section.id)}
                              title={section.enabled ? "Disable" : "Enable"}
                            >
                              {section.enabled ? "👁️" : "👁️‍🗨️"}
                            </button>
                            <button
                              className="icon-button"
                              onClick={() =>
                                setEditingSection(
                                  editingSection === section.id ? null : section.id
                                )
                              }
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-button"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {editingSection === section.id && (
                          <SectionEditor
                            section={section}
                            onUpdate={(updates) =>
                              handleUpdateSection(section.id, updates)
                            }
                            onClose={() => setEditingSection(null)}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="add-section">
        <h4>Add New Section</h4>
        <div className="section-type-buttons">
          {SECTION_TYPES.map((type) => (
            <button
              key={type.value}
              className="section-type-button"
              onClick={() => handleAddSection(type.value)}
            >
              + {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionManager;

