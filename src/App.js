import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentForm from './DocumentForm';
import ResultPage from './ResultPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<DocumentForm />} />
        <Route path="/viewer" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
