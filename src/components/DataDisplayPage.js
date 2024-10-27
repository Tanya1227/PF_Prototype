import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PDFViewer from '../utils/PDFViewer';

const DataDisplayPage = () => {
  const location = useLocation();
  const { fields, data, file } = location.state;
  const [filetype, setFiletype] = useState(null);
  const [highlightedCoords, setHighlightedCoords] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    console.log("Coordinates Map: ", data);
    if (file) {
      const type = file.type.split('/')[0]; // 'image' or 'application'
      setFiletype(type);
    }
  }, [file, data]);

  const handleInputClick = (entityName) => {
    console.log(`Clicked input for entity: ${entityName}`);
    const coords = data.data.filter(item => item.entityName.toLowerCase() === entityName.toLowerCase());
    console.log("Highlighting coordinates: ", coords.map(item => item.pixelCoord));

    // Set highlighted coordinates
    setHighlightedCoords(coords.map(item => item.pixelCoord));

    // Combine all entity values with the same entity name
    const combinedValue = coords.map(item => item.entityValue).join(', ');
    setFieldValues(prev => ({ ...prev, [entityName]: combinedValue }));
  };

  const handleChange = (field, value) => {
    setFieldValues(prev => ({ ...prev, [field]: value }));
  };

  const renderRectangles = () => {
    console.log("Rendering rectangles for highlighted coordinates: ", highlightedCoords);
    return highlightedCoords.map((coords, index) => {
      const [[x1, y1], , [x3, y3]] = coords.map(coord => coord.map(c => c - 1)); // Adjust for zero indexing
      const width = x3 - x1;
      const height = y3 - y1;

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${width}px`,
            height: `${height}px`,
            border: '4px solid red',
            pointerEvents: 'none',
            boxSizing: 'border-box',
          }}
        />
      );
    });
  };

  const handlePDFRender = (width, height) => {
    // Optionally handle any adjustments based on the PDF size
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 relative">
      <div className="w-full h-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Document Data
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section: Display PDF or Image */}
            <div className="flex flex-col items-center relative">
              {filetype === 'image' ? (
                <div style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'hidden' }}>
                  <img
                    src={URL.createObjectURL(file)} // Ensure you're using the correct file here
                    alt="Uploaded Preview"
                    className="h-72 object-contain rounded-lg shadow-lg mb-4"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  {renderRectangles()}
                </div>
              ) : filetype === 'application' ? (
                <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                  <PDFViewer file={file} onRender={handlePDFRender} />
                  {renderRectangles()}
                </div>
              ) : null}
            </div>

            {/* Right Section: Fields and Input Boxes */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <label className="font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={fieldValues[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onClick={() => handleInputClick(field)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              <button
                onClick={() => console.log('Save Button Clicked')}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplayPage;
