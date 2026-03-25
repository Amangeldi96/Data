import React, { useState, useEffect } from 'react';
import { myRawData } from './data'; // data.js файлы src ичинде болушу керек
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Маалыматтар бар экенин текшерүү
    if (myRawData && Array.isArray(myRawData)) {
      setResults(myRawData.slice(0, 15));
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW катасы:', err));
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

    const filtered = myRawData.filter(item =>
      Object.values(item).some(v => 
        String(v).toLowerCase().replace(/[^a-z0-9а-я]/g, '').includes(cleanQuery)
      )
    );
    setResults(filtered.slice(0, 50));
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{textAlign: 'center', marginBottom: '15px'}}>Издөө</h2>
        <input 
          className="search-input"
          placeholder="Код же ФИО жазыңыз..." 
          value={query} 
          onChange={handleSearch} 
        />
        <div style={{textAlign: 'center', fontSize: '12px', marginTop: '10px', opacity: 0.8}}>
          Базада: {myRawData?.length || 0} | Табылды: {results.length}
        </div>
      </div>

      <div className="list">
        {results.length > 0 ? (
          results.map((item, i) => (
            <div key={i} className="card">
              {Object.entries(item).map(([k, v]) => (
                <p key={k}>
                  <b>{k}</b>
                  <span>{v || '-'}</span>
                </p>
              ))}
            </div>
          ))
        ) : (
          <div className="no-result">Эч нерсе табылган жок 🔍</div>
        )}
      </div>
    </div>
  );
}

export default App;