import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  
  useEffect(() => {
    const getData = async () => {
      try{
        const { data: { list } } = await axios.get(`dartAPI/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=00287812&bgn_de=20210601&end_de=20220611`)
        console.log(list)       
      } catch(e) {  
        console.log(e)
      }
    }
    getData()
  },[])

  return (
    <div className="App">
      <div onClick={() => {
        window.open('https://naver.com')
      }}>open Dart</div>
    </div>
  );
}

export default App;
