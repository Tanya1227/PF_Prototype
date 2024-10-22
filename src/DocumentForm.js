import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [file, setFile] = useState(null);
  const [fieldNames, setFieldNames] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFieldNamesChange = (e) => {
    setFieldNames(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !fieldNames) {
      alert('Please upload a file and enter field names.');
      return;
    }

    // Split field names by comma and trim whitespace
    const enteredFieldNames = fieldNames.split(',').map(name => name.trim());

    // Simulating the backend response with static data
    const mockBackendResponse = [
      {
        "serialNo": "1",
        "id": "14",
        "entityValue": "US-001",
        "entityName": "Location",
        "pixelCoord": [[652.0, 211.0], [695.0, 211.0], [695.0, 227.0], [652.0, 227.0]]
      },
      {
        "serialNo": "2",
        "id": "15",
        "entityValue": "John",
        "entityName": "Name",
        "pixelCoord": [[55.0, 235.0], [83.0, 235.0], [83.0, 249.0], [55.0, 249.0]]
      },
      {
        "serialNo": "3",
        "id": "33",
        "entityValue": "2312/2019",
        "entityName": "Date",
        "pixelCoord": [[637.0, 265.0], [695.0, 265.0], [695.0, 277.0], [637.0, 277.0]]
      },
      {
        "serialNo": "4",
        "id": "60",
        "entityValue": "$154.06",
        "entityName": "Amount",
        "pixelCoord": [[626.0, 555.0], [685.0, 555.0], [685.0, 575.0], [626.0, 575.0]]
      }
    ];

    // Filter the backend response to include only the entered field names
    const filteredFieldData = mockBackendResponse.filter(field =>
      enteredFieldNames.includes(field.entityName)
    );

    // Navigate to the viewer page with the filtered backend response and document
    navigate('/viewer', { 
      state: { 
        fieldData: filteredFieldData, 
        documentUrl: URL.createObjectURL(file) 
      } 
    });
  };

  return (
    <div>
      <h2>Upload Document and Enter Field Names</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} required />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter field names, separated by commas"
            value={fieldNames}
            onChange={handleFieldNamesChange}
            required
          />
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

export default App;
