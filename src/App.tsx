import React from 'react';
import { Reset } from 'styled-reset';
import './App.css';

import CorpSearch from './components/CorpSearch';
import StockChart from './components/StockChart';

function App() {
  return (
    <>
      <Reset />
      <div className="App">
        <div className='Container'>
          <CorpSearch />
          <StockChart />
        </div>
      </div>
    </>

  );
}

export default App;
