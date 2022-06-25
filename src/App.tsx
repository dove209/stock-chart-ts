import React from 'react';
import { Reset } from 'styled-reset';
import './App.css';

import CorpSearch from './components/CorpSearch';
import NaverStock from './components/NaverStock';

function App() {
  return (
    <>
      <Reset />
      <div className="App">
        <div className='Container'>
          <CorpSearch />
          <NaverStock />
        </div>
      </div>
    </>

  );
}

export default App;
