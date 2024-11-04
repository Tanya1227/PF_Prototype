import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PDFViewer from '../utils/PDFViewer';

const DataDisplayPage = () => {
  const location = useLocation();
  const { fields, data, file } = location.state;
  const [filetype, setFiletype] = useState(null);
  const [highlightedCoords, setHighlightedCoords] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [rectangle, setRectangle] = useState(null); // Track only one rectangle
  const [startPoint, setStartPoint] = useState(null);
  const [selectedField, setSelectedField] = useState(null); // Track the selected input field
  const imgRef = useRef(null);

  useEffect(() => {
    console.log("Coordinates Map: ", data);
    if (file) {
      const type = file.type.split('/')[0]; // 'image' or 'application'
      setFiletype(type);

      fields.map((entityName, index) => {
        // Get the coordinates of the selected entity
        const coords = data.data.filter(item => item.entityName.toLowerCase() === entityName.toLowerCase());

        // Combine all entity values with the same entity name
        const combinedValue = coords.map(item => item.entityValue).join(' ');
        setFieldValues(prev => ({ ...prev, [entityName]: combinedValue }));
      })
    }
  }, [file, data]);

  const handleInputClick = (entityName) => {
    console.log(`Clicked input for entity: ${entityName}`);
    setSelectedField(entityName); // Set the selected field for rectangle drawing
    const coords = data.data.filter(item => item.entityName.toLowerCase() === entityName.toLowerCase());

    setHighlightedCoords(coords.map(item => item.pixelCoord));
  };

  const handleChange = (field, value) => {
    setFieldValues(prev => ({ ...prev, [field]: value }));
  };

  const handleMouseDown = (e) => {
    if (!selectedField) {
      alert("Please select an input field before drawing.");
      return;
    }
    setDrawing(true);
    const rect = imgRef.current.getBoundingClientRect();
    setStartPoint({
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    });
  };

  const handleMouseMove = (e) => {
    if (!drawing || !startPoint) return;

    const rect = imgRef.current.getBoundingClientRect();
    const endPoint = {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    };

    const newRectangle = {
      x: Math.min(startPoint.x, endPoint.x),
      y: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(startPoint.x - endPoint.x),
      height: Math.abs(startPoint.y - endPoint.y),
    };

    setRectangle(newRectangle); // Replace the previous rectangle with a new one
  };

  const handleMouseUp = () => {
    if (drawing && startPoint) {
      setDrawing(false);
      setStartPoint(null);

      // Mock API response: Log coordinates and populate selected input with mock value
      const rectangleCoords = {
        x1: rectangle.x,
        y1: rectangle.y,
        x2: rectangle.x + rectangle.width,
        y2: rectangle.y + rectangle.height,
      };
      console.log("Rectangle Coordinates:", rectangleCoords);

      // Simulate API response with mock entity value
      const mockApiResponse = { entityvalue: "monika shinde" };
      if (selectedField) {
        setFieldValues(prev => ({ ...prev, [selectedField]: mockApiResponse.entityvalue }));
      }

      // Clear selected field after setting the value
      setSelectedField(null);
    }
  };

  const renderHighlightedRectangles = () => {
    return highlightedCoords.map((coords, index) => {
      const [[x1, y1], , [x3, y3]] = coords.map(coord => coord.map(c => c - 1));
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

  const renderRectangle = () => {
    if (!rectangle) return null;
    return (
      <div
        style={{
          position: 'absolute',
          left: `${rectangle.x}px`,
          top: `${rectangle.y}px`,
          width: `${rectangle.width}px`,
          height: `${rectangle.height}px`,
          border: '2px solid blue',
          pointerEvents: 'none',
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 relative">
      <div className="w-full h-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            PF 2.0 Document Extractor
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section: Display PDF or Image */}
            <div
              className="flex flex-col items-center relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {filetype === 'image' ? (
                <div style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'hidden' }}>
                  <img
                    ref={imgRef}
                    src={URL.createObjectURL(file)}
                    alt="Uploaded Preview"
                    className="h-72 object-contain rounded-lg shadow-lg mb-4"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  {renderRectangle()}
                  {renderHighlightedRectangles()}
                </div>
              ) : filetype === 'application' ? (
                <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                  <PDFViewer file={file} onRender={() => {}} />
                  {renderRectangle()}
                  {renderHighlightedRectangles()}
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