import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PDFViewer from '../utils/PDFViewer';

const DataDisplayPage = () => {
  const location = useLocation();
  const { fields, data, file } = location.state;
  const [filetype, setFiletype] = useState(null);
  const [highlightedCoords, setHighlightedCoords] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  
  // State for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const startCoordsRef = useRef(null);
  const currentCoordsRef = useRef(null);

  useEffect(() => {
    console.log("Coordinates Map: ", data);
    if (file) {
      const type = file.type.split('/')[0]; // 'image' or 'application'
      setFiletype(type);
    }
  }, [file, data]);

  const handleInputClick = (entityName, e) => {
    e.stopPropagation(); // Prevents triggering mouse events on the drawing area
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

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsDrawing(true);
    startCoordsRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    currentCoordsRef.current = startCoordsRef.current; // Initialize current coords
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    currentCoordsRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    // Update highlighted coordinates to render rectangle
    const newCoords = [startCoordsRef.current, currentCoordsRef.current];
    setHighlightedCoords([newCoords]);
  };

  const handleMouseUp = (entityName) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const [[x1, y1], [x2, y2]] = [startCoordsRef.current, currentCoordsRef.current];
    const rectCoords = [Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)];

    // Combine values of entities that intersect the drawn rectangle
    const combinedValue = data.data
      .filter(item => {
        const [itemX, itemY] = item.pixelCoord;
        return itemX >= rectCoords[0] && itemX <= rectCoords[0] + rectCoords[2] &&
               itemY >= rectCoords[1] && itemY <= rectCoords[1] + rectCoords[3];
      })
      .map(item => item.entityValue)
      .join(', ');

    // Fill the input box
    setFieldValues(prev => ({ ...prev, [entityName]: combinedValue }));
    setHighlightedCoords([]); // Clear highlighted rectangle after use
  };

  const renderRectangles = () => {
    return highlightedCoords.map((coords, index) => {
      const [[x1, y1], [x2, y2]] = coords;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 relative">
      <div className="w-full h-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Document Data
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section: Display PDF or Image */}
            <div className="flex flex-col items-center relative" 
                 onMouseDown={handleMouseDown} 
                 onMouseMove={handleMouseMove} 
                 onMouseUp={() => handleMouseUp('YourEntityName')}>
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
                  <PDFViewer file={file} />
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
                    onClick={(e) => handleInputClick(field, e)} // Prevent mouse events from triggering drawing
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
