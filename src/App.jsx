import './App.css';
import PhonemeContainerNew from './components/PhonemeContainerNew/PhonemeContainerNew';
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
      <div className="App-body">
        <PhonemeContainerNew phonemeData={phonemeData} />
      </div>
    </div>
  );
}

export default App;
