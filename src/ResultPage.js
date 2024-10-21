import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css'; // Assuming you have some basic styles in App.css

const ResultPage = () => {
  const location = useLocation();
  const { fields, fileData } = location.state;

  return (
    <div className="result-container">
      {/* Left Section: Document Preview */}
      <div className="left-section full-height">
        {fileData ? (
          <embed src={URL.createObjectURL(fileData)} width="100%" height="100%" type={fileData.type} />
        ) : (
          <p>No document available for preview</p>
        )}
      </div>

      {/* Right Section: Fields */}
      <div className="right-section full-height">
        <h1>Enter Data for Fields</h1>
        {fields.map((field, index) => (
          <div key={index} className="input-group">
            <label>{field.value}</label>
            <input type="text" placeholder={`Enter ${field.value}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
