import React, { useState, useEffect } from 'react';
import { myRawData } from './data'; // src/data.js файлында export болушу керек
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Биринчи жолу ачылганда 15 сапты көрсөтүү
  useEffect(() => {
    if (myRawData && Array.isArray(myRawData)) {
      setResults(myRawData.slice(0, 15));
    }

    // PWA (Оффлайн режим) үчүн Service Worker каттоо
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW катасы:', err));
      });
    }
  }, []);

  // Издөө функциясы (Акыркы 4 цифраны жана текстти табуу)
  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    // Эгер издөө бош болсо, баштапкы 15 сапты кайтаруу
    if (!val.trim()) {
      setResults(myRawData.slice(0, 15));
      return;
    }

    // Издөө текстин тазалоо (кичинекей тамга, боштуктарды жана белгилерди алуу)
    const cleanQuery = val.toLowerCase().trim().replace(/[^a-z0-9а-я]/g, '');

    const filtered = myRawData.filter(item => {
      return Object.values(item).some(v => {
        if (!v) return false;
        
        // Базадагы маанини текстке айлантып тазалоо
        const stringValue = String(v).toLowerCase().replace(/[^a-z0-9а-я]/g, '');
        
        // 1. Жөнөкөй издөө (тексттин каалаган жеринде камтылса)
        const isMatch = stringValue.includes(cleanQuery);
        
        // 2. АКЫРКЫ 4 ЦИФРА: Эгер колдонуучу так 4 цифра жазса, коддун аягын текшерүү
        let isLastFourMatch = false;
        if (cleanQuery.length === 4 && !isNaN(cleanQuery)) {
          isLastFourMatch = stringValue.endsWith(cleanQuery);
        }

        return isMatch || isLastFourMatch;
      });
    });

    // Натыйжаны 100 сапка чейин чектөө (телефондо ылдам иштеши үчүн)
    setResults(filtered.slice(0, 100));
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>ЭНИ Издөө</h2>
        <div className="search-wrapper">
          <input 
            className="search-input"
            placeholder="Код (акыркы 4 сан) же ФИО..." 
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