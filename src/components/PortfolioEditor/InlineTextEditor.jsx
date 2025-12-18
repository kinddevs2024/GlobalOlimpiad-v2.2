import { useState, useRef, useEffect } from "react";
import "./InlineTextEditor.css";

const InlineTextEditor = ({
  value,
  onSave,
  onCancel,
  placeholder = "Click to edit...",
  multiline = false,
  className = "",
  tag: Tag = "span",
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        inputRef.current.select();
      } else {
        // For single-line, select all text
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Enter" && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    const trimmedValue = editValue.trim();
    if (trimmedValue !== (value || "")) {
      onSave?.(trimmedValue);
    }
    setEditValue(value || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value || "");
    onCancel?.();
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  if (!isEditing) {
    return (
      <Tag
        className={`portfolio-inline-editable ${className}`}
        onClick={handleClick}
        {...props}
      >
        {value || <span className="portfolio-inline-placeholder">{placeholder}</span>}
      </Tag>
    );
  }

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <InputComponent
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`portfolio-inline-editor-input ${className}`}
      placeholder={placeholder}
      {...(multiline && { rows: 3 })}
      {...props}
    />
  );
};

export default InlineTextEditor;

