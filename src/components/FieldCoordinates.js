// FieldCoordinates.js
import React from 'react';

const FieldCoordinates = ({ file, coordinates }) => {
  const previewStyle = {
    position: 'relative',
    width: '100%',
    height: 'auto',
    maxHeight: '400px', // Set a fixed height for consistent coordinates
    overflow: 'hidden',
  };

  return (
    <div style={previewStyle}>
      {file && file.type.startsWith('image/') && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="object-contain w-full h-full"
        />
      )}
      {/* Example of drawing rectangles based on coordinates */}
      {coordinates.map((coord, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: `${coord.y}%`, // Assuming these are percentage values
            left: `${coord.x}%`,
            width: `${coord.width}%`,
            height: `${coord.height}%`,
            border: '2px solid rgba(255, 0, 0, 0.7)',
            pointerEvents: 'none', // Prevent mouse events on the rectangle
          }}
        />
      ))}
    </div>
  );
};

export default FieldCoordinates;
