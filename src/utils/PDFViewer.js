import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Set the path to the worker script
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

const PDFViewer = ({ file }) => {
  const canvasRef = useRef();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderTask, setRenderTask] = useState(null); // Track the current render task

  useEffect(() => {
    const loadingTask = getDocument(URL.createObjectURL(file));
    loadingTask.promise.then((pdf) => {
      setNumPages(pdf.numPages);
      renderPage(pageNumber, pdf);
    }, (reason) => {
      console.error(reason);
    });
  }, [file, pageNumber]);

  const renderPage = async (num, pdf) => {
    if (renderTask) {
      renderTask.cancel(); // Cancel previous render task if it's still running
    }

    const page = await pdf.getPage(num);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    const task = page.render(renderContext);
    setRenderTask(task); // Store the current render task

    task.promise.then(() => {
      setRenderTask(null); // Clear the render task once it's done
    }).catch((error) => {
      console.error('Render error:', error);
      setRenderTask(null); // Clear the render task on error
    });
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto' }} // Make sure canvas takes full width
      />
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
