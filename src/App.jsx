import React, { useState, useEffect } from 'react';
import { myRawData } from './data'; 
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (myRawData && Array.isArray(myRawData)) {
      setResults(myRawData.slice(0, 15));
    }

    // Service Worker каттоо (Жолун '/sw.js' деп так жазуу керек)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW катталды!', reg.scope))
          .catch(err => console.log('SW катасы:', err));
      });
    }
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (!val.trim()) {
      setResults(myRawData.slice(0, 15));
      return;
    }

    const cleanQuery = val.toLowerCase().trim().replace(/[^a-z0-9а-я]/g, '');

    const filtered = myRawData.filter(item => {
      return Object.values(item).some(v => {
        if (!v) return false;
        const stringValue = String(v).toLowerCase().replace(/[^a-z0-9а-я]/g, '');
        
        const isMatch = stringValue.includes(cleanQuery);
        
        let isLastFourMatch = false;
        if (cleanQuery.length === 4 && !isNaN(cleanQuery)) {
          isLastFourMatch = stringValue.endsWith(cleanQuery);
        }

        return isMatch || isLastFourMatch;
      });
    });

    setResults(filtered.slice(0, 100));
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>ЭНИ Издөө</h2>
        <div className="search-wrapper">
          <input 
            className="search-input"
            placeholder="Код же ФИО жазыңыз..." 
            value={query} 
            onChange={handleSearch} 
          />
        </div>
        <div className="stats-info">
          Базада: <b>{myRawData?.length.toLocaleString() || 0}</b> | Табылды: <b>{results.length}</b>
        </div>
      </div>

      <div className="list">
        {results.length > 0 ? (
          results.map((item, i) => (
            <div key={i} className="card">
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="data-row">
                  <span className="data-label">{k}</span>
                  <span className="data-value">{v || '-'}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="no-result">
            <span style={{ fontSize: '40px' }}>🔍</span>
            <p>Эч нерсе табылган жок</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;