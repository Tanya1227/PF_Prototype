import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentForm from './components/DocumentForm';
import DataDisplayPage from './components/DataDisplayPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<DocumentForm />} />
        <Route path="/data-display" element={<DataDisplayPage />} />
      </Routes>
    </div>
  );
}

export default App;
