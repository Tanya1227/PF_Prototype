import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { fieldData, documentUrl } = location.state;

  const [highlightedField, setHighlightedField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  const highlightField = (coords, entityName) => {
    setHighlightedField(coords);
    setFieldValues(prevValues => ({
      ...prevValues,
      [entityName]: fieldValues[entityName] || '',
    }));
  };

  const handleFieldValueChange = (entityName, value) => {
    setFieldValues(prevValues => ({
      ...prevValues,
      [entityName]: value,
    }));
  };

  useEffect(() => {
    const highlightBox = document.getElementById('highlightBox');
    if (highlightedField) {
      const x1 = highlightedField[0][0];
      const y1 = highlightedField[0][1];
      const x2 = highlightedField[2][0]; // Using [2] for the bottom-right corner
      const y2 = highlightedField[2][1];

      highlightBox.style.left = `${x1}px`;
      highlightBox.style.top = `${y1}px`;
      highlightBox.style.width = `${x2 - x1}px`;
      highlightBox.style.height = `${y2 - y1}px`;
      highlightBox.style.display = 'block';
    }
  }, [highlightedField]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ position: 'relative', width: '70%' }}>
        {/* Display Document */}
        <embed src={documentUrl} width="100%" height="600px" type="application/pdf" />

        {/* Highlight Box */}
        {highlightedField && (
          <div
            id="highlightBox"
            style={{
              position: 'absolute',
              border: '2px solid red',
              display: 'block', // Always show the highlight box
              pointerEvents: 'none', // Allow clicks to pass through
              zIndex: 1,
            }}
          ></div>
        )}
      </div>

      <div style={{ width: '30%', padding: '10px' }}>
        <h2>Field Names</h2>
        <ul>
          {fieldData.map((field) => (
            <li key={field.id} onClick={() => highlightField(field.pixelCoord, field.entityName)}>
              {field.entityName}:
              <input
                type="text"
                value={fieldValues[field.entityName] || field.entityValue}
                onChange={(e) => handleFieldValueChange(field.entityName, e.target.value)}
                style={{ marginLeft: '5px', width: '80%' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultPage;
