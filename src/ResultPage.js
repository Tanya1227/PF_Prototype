import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { fieldData, documentUrl } = location.state;

  const [highlightedField, setHighlightedField] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  const highlightField = (coords, entityName) => {
    setHighlightedField([]);
    // If coords is an array, highlight each one in sequence
    if (Array.isArray(coords)) {
      coords.forEach((coord, index) => {
        console.log("Coord: ", coord);

        setHighlightedField(prevCoord => (
          [...prevCoord, coord]
        ));
        // Optional: You can add a condition to set fieldValues if needed
        setFieldValues(prevValues => ({
          ...prevValues,
          [entityName]: fieldValues[entityName] || '',
        }));
      });
    } else {
      setHighlightedField([coords]);
      setFieldValues(prevValues => ({
        ...prevValues,
        [entityName]: fieldValues[entityName] || '',
      }));
    }
  };

  const handleFieldValueChange = (entityName, value) => {
    setFieldValues(prevValues => ({
      ...prevValues,
      [entityName]: value,
    }));
  };

  // Group fields by entityName, collecting all entityValues and pixelCoords for each unique entityName
  const groupedFields = fieldData.reduce((acc, field) => {
    if (!acc[field.entityName]) {
      acc[field.entityName] = {
        ...field,
        entityValue: field.entityValue,
        pixelCoords: [field.pixelCoord]
      };
    } else {
      acc[field.entityName].entityValue += `, ${field.entityValue}`;
      acc[field.entityName].pixelCoords.push(field.pixelCoord);
    }
    return acc;
  }, {});

  // const calculateBoundingBox = (coords) => {
  //   if (!coords || coords.length === 0) return null;

  //   const minX = Math.min(...coords.map(coord => coord.x));
  //   const minY = Math.min(...coords.map(coord => coord.y));
  //   const maxX = Math.max(...coords.map(coord => coord.x));
  //   const maxY = Math.max(...coords.map(coord => coord.y));

  //   return {
  //     left: minX,
  //     top: minY,
  //     width: maxX - minX,
  //     height: maxY - minY,
  //   };
  // };

  // const highlightBoxStyle = calculateBoundingBox(highlightedField);

  useEffect(() => {
    console.log("Field Data: ", fieldData);
    console.log("Highlighted Field: ", highlightedField);

    if (highlightedField.length > 0) {
      for (let i = 0; i < highlightedField.length; i++) {
        const highlightBox = document.getElementById(`highlightBox_${i}`);
        const x1 = highlightedField[i][0][0];
        const y1 = highlightedField[i][0][1];
        const x2 = highlightedField[i][2][0]; // Using [2] for the bottom-right corner
        const y2 = highlightedField[i][2][1];

        highlightBox.style.left = `${x1}px`;
        highlightBox.style.top = `${y1}px`;
        highlightBox.style.width = `${x2 - x1}px`;
        highlightBox.style.height = `${y2 - y1}px`;
        highlightBox.style.display = 'block';
      }
    }
  }, [highlightedField]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ position: 'relative', width: '70%' }}>
        {/* Display Document */}
        <embed src={documentUrl} width="100%" height="600px" type="application/pdf" />

        {/* Highlight Box */}
        {highlightedField.length > 0 && highlightedField.map((field, index) => (
          <div
            key={index} // Ensure each box has a unique key
            id={`highlightBox_${index}`} // Optional: unique ID for each box
            style={{
              position: 'absolute',
              border: '2px solid red',
              display: 'block', // Always show the highlight box
              pointerEvents: 'none', // Allow clicks to pass through
              zIndex: 1,
              left: field.x, // Assuming each field has an x coordinate
              top: field.y, // Assuming each field has a y coordinate
              width: field.width, // Assuming each field has a width
              height: field.height, // Assuming each field has a height
            }}
          ></div>
        ))}
      </div>

      <div style={{ width: '30%', padding: '10px' }}>
        <h2>Field Names</h2>
        <ul>
          {Object.entries(groupedFields).map(([entityName, field]) => (
            <li key={field.id}>
              {entityName}:
              <input
                type="text"
                value={fieldValues[entityName] || field.entityValue}
                onChange={(e) => handleFieldValueChange(entityName, e.target.value)}
                onClick={() => highlightField(field.pixelCoords, entityName)} // Pass the array of pixelCoords
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
