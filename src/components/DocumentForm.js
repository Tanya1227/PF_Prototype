import React, { useState } from 'react';
import PDFViewer from '../utils/PDFViewer';
import { useNavigate } from 'react-router-dom'; // Assuming you have this component




const OCRApp = () => {
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile);
    } else {
      alert('Please upload an image or a PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile);
    } else {
      alert('Please upload an image or a PDF file.');
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAddField = () => {
    if (fieldName) {
      setFields((prevFields) => [...prevFields, fieldName]);
      setFieldName('');
    }
  };

  const handleReplaceFile = () => {
    setFile(null);
  };

  const handleSubmit = () => {
    console.log('Submitting:', { fields, file });
    // Add your API logic here

    const data= 
    {
      "fields": [
       
        "name",
        "date"
      ],
      "data": [
        {
          "serial no.": 1,
          "id": 8,
          "entityValue": "MONIKA",
          "entityName": "name",
          "pixelCoord": [
            [
              25,
              99
            ],
            [
              98,
              99
            ],
            [
              98,
              116
            ],
            [
              25,
              116
            ]
          ]
        },
        {
          "serial no.": 2,
          "id": 9,
          "entityValue": "MAHADEV",
          "entityName": "name",
          "pixelCoord": [
            [
              104,
              101
            ],
            [
              190,
              101
            ],
            [
              190,
              115
            ],
            [
              104,
              115
            ]
          ]
        },
        {
          "serial no.": 3,
          "id": 10,
          "entityValue": "SHINDE",
          "entityName": "name",
          "pixelCoord": [
            [
              198,
              101
            ],
            [
              267,
              101
            ],
            [
              267,
              115
            ],
            [
              198,
              115
            ]
          ]
        },
        {
          "serial no.": 4,
          "id": 13,
          "entityValue": "31/10/1992",
          "entityName": "date",
          "pixelCoord": [
            [
              24,
              176
            ],
            [
              128,
              176
            ],
            [
              128,
              193
            ],
            [
              24,
              193
            ]
          ]
        },
        {
          "serial no.": 5,
          "id": 18,
          "entityValue": "MONIKA",
          "entityName": "name",
          "pixelCoord": [
            [
              20,
              250
            ],
            [
              92,
              254
            ],
            [
              91,
              275
            ],
            [
              19,
              271
            ]
          ]
        },
        {
          "serial no.": 6,
          "id": 20,
          "entityValue": "SHINDE",
          "entityName": "name",
          "pixelCoord": [
            [
              125,
              254
            ],
            [
              197,
              252
            ],
            [
              197,
              270
            ],
            [
              125,
              273
            ]
          ]
        }
      ]
    }
   
    navigate('/data-display', { state: { fields, data, file } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full h-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            PF 2.0 Document Extractor
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section: Upload Area */}
            <div className="space-y-4">
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 h-64 flex flex-col items-center justify-center transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-gray-500 space-y-2 text-center"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="block font-medium">
                      Drag and drop your document here
                    </span>
                    <span className="block text-sm">or click to upload</span>
                  </label>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-72 object-contain rounded-lg shadow-lg mb-4"
                    />
                  ) : (
                    <PDFViewer file={file} />
                  )}
                  <button
                    onClick={handleReplaceFile}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Replace File
                  </button>
                </div>
              )}
            </div>

            {/* Right Section: Field Input and List */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter field name"
                />
                <button
                  onClick={handleAddField}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {fields.length === 0 ? (
                  <p className="text-gray-500 text-center p-4">No fields added yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <li key={index} className="flex items-center justify-between p-4">
                        <span className="text-gray-700">{field}</span>
                        <button
                          onClick={() => setFields(fields.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-red-500 focus:outline-none"
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRApp;