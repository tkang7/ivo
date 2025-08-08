import { useState, useEffect } from 'react';
import { DocRenderer } from './components/DocRenderer';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the sample input data
        const response = await fetch('/input_data/sample_input.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const textData = await response.text();
        const jsonData = JSON.parse(textData);

        // Handle array of documents - take the first one
        const documentData = Array.isArray(jsonData) ? jsonData[0] : jsonData;
        
        // Log the processed data for debugging
        console.log('=== PROCESSED DOCUMENT DATA ===');
        console.log(JSON.stringify(documentData, null, 2));
        console.log('=== END PROCESSED DOCUMENT DATA ===');
        
        setData(documentData);
      } catch (err) {
        console.error('Error fetching or parsing data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Contract</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full" style={{position: 'absolute', top: 0, left: 0, right: 0}}>
      <div className="w-full h-full max-w-none">
        <div className="bg-white min-h-screen p-6 w-full max-w-none">
          {data && <DocRenderer node={data} />}
        </div>
      </div>
    </div>
  );
}

export default App;