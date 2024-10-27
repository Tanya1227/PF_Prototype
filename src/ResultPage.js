import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { fields, data } = location.state;

  return (
    <div className="flex">
      {/* Left Section: Image with Highlights */}
      <div className="relative">
        <img src={URL.createObjectURL(location.state.file)} alt="Document" className="h-auto max-w-full" />
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: item.pixelCoord[0][1], // Y coordinate
              left: item.pixelCoord[0][0], // X coordinate
              width: item.pixelCoord[2][0] - item.pixelCoord[0][0], // Width calculation
              height: item.pixelCoord[2][1] - item.pixelCoord[0][1], // Height calculation
              border: '2px solid red',
              pointerEvents: 'none', // Make sure it doesn't interfere with clicks
            }}
          />
        ))}
      </div>

      {/* Right Section: Field Inputs */}
      <div className="ml-4">
        {fields.map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700">{field}</label>
            <input
              type="text"
              defaultValue={
                data.find((item) => item.entityName === field)?.entityValue || ''
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
};

export default ResultPage;
