// DocumentForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Assuming you have styles in App.css

const DocumentForm = () => {
  const [fields, setFields] = useState([{ id: 1, value: "" }]);
  const [filePreview, setFilePreview] = useState("Document preview will appear here.");
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData(file);
    if (file) {
      const fileType = file.type;
      const reader = new FileReader();

      if (fileType.startsWith("text") || fileType === "application/pdf") {
        reader.onload = (event) => {
          setFilePreview(event.target.result.substring(0, 500) + "...");
        };
        reader.readAsText(file);
      } else if (fileType.startsWith("image")) {
        reader.onload = (event) => {
          setFilePreview(<img src={event.target.result} alt="Uploaded Document Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(`Cannot preview this file type (${fileType}).`);
      }
    } else {
      setFilePreview("Document preview will appear here.");
    }
  };

  const handleAddField = () => {
    setFields([...fields, { id: fields.length + 1, value: "" }]);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleInputChange = (id, event) => {
    const newFields = fields.map(field => field.id === id ? { ...field, value: event.target.value } : field);
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/result', { state: { fields, fileData } });
    }, 2000);
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <div className="input-group">
          <label htmlFor="fileUpload">Upload Document</label>
          <input type="file" id="fileUpload" onChange={handleFileChange} />
        </div>
        <div className="preview-container">
          {typeof filePreview === "string" ? <p>{filePreview}</p> : filePreview}
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h1>Enter Field Names to Extract</h1>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.id} className="input-group">
              <input 
                type="text" 
                placeholder="e.g. Name, Date, etc." 
                value={field.value} 
                onChange={(e) => handleInputChange(field.id, e)} 
                required 
              />
              <button 
                type="button" 
                className="remove-field-btn" 
                onClick={() => handleRemoveField(field.id)}
              >
                &#x2716;
              </button>
            </div>
          ))}
          <button type="button" className="add-field-btn" onClick={handleAddField}>Add Another Field</button>
          <input type="submit" value="Next" />
        </form>
      </div>

      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default DocumentForm;
