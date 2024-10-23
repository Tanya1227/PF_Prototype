import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Set the path to the worker script
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

const PDFViewer = ({ file }) => {
  const canvasRef = useRef();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const loadingTask = getDocument(URL.createObjectURL(file));
    loadingTask.promise.then((pdf) => {
      setNumPages(pdf.numPages);
      renderPage(pageNumber, pdf);
    }, (reason) => {
      console.error(reason);
    });
  }, [file, pageNumber]);

  const renderPage = (num, pdf) => {
    pdf.getPage(num).then((page) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <div className="flex space-x-2 mt-2">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((prev) => prev + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PDFViewer;
