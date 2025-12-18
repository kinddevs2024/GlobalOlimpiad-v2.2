import { useState } from "react";
import "./DraggableSection.css";

const DraggableSection = ({
  section,
  index,
  isOwner,
  children,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!isOwner) {
    return <>{children}</>;
  }

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", section.id);
    e.dataTransfer.setData("application/json", JSON.stringify({ sectionId: section.id, index }));
    onDragStart?.(section.id, index);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDragOver(false);
    onDragEnd?.();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
    onDragOver?.(section.id, index);
  };

  const handleDragLeave = (e) => {
    // Only set dragOver to false if we're actually leaving the element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const draggedSectionId = e.dataTransfer.getData("text/plain");
    const draggedData = e.dataTransfer.getData("application/json");
    let draggedIndex = null;
    
    try {
      const parsed = JSON.parse(draggedData);
      draggedIndex = parsed.index;
    } catch (err) {
      console.error("Error parsing drag data:", err);
    }

    if (draggedSectionId && draggedSectionId !== section.id) {
      onDrop?.(draggedSectionId, section.id, draggedIndex, index);
    }
  };

  return (
    <div
      className={`portfolio-draggable-section ${isDragging ? "dragging" : ""} ${dragOver ? "drag-over" : ""}`}
      draggable={isOwner}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-section-id={section.id}
      data-section-index={index}
    >
      {children}
    </div>
  );
};

export default DraggableSection;

