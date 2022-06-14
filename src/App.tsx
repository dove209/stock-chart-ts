import React from 'react';
import './App.css';

import CorpSearch from './components/CorpSearch';
import OpenDart from './components/OpenDart';
import NaverStock from './components/NaverStock';

function App() {
  return (
    <div className="App">
      <CorpSearch />
      <NaverStock />
      <OpenDart />
    </div>
  );
}

export default App;
