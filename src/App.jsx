import './App.css';
import PhonemeContainer from './components/PhonemeContainer/PhonemeContainer';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {

  const [phonemeData, setPhonemeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.jsonld');
        const data = await response.json();
        setPhonemeData(data);
      } catch (error) {
        console.error("Error fetching phoneme data: ", error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className="App">
      <body className="App-body">
        <PhonemeContainer phonemeData={phonemeData} />
      </body>
    </div>
  );
}

export default App;
