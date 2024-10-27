import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentForm from './components/DocumentForm';
import DataDisplayPage from './components/DataDisplayPage';
import ResultPage from './ResultPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<DocumentForm />} />
        <Route path="/viewer" element={<ResultPage />} />
        <Route path="/data-display" element={<DataDisplayPage />} />
      </Routes>
    </div>
  );
}

export default App;
