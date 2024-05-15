import logo from './logo.svg';
import {useState} from 'react';
import './App.css';

function App() {

  const [started, setStarted] = useState(false);
  const [gameId, setGameId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState(0);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState(null);
  const [won, setWon] = useState(false);

  async function startGame(){
    setLoading(true)
    const response = await fetch("http://localhost:8080/partita", {method: "POST"});
    const r = await response.json();
    setGameId(r.id);
    setStarted(true);
    setLoading(false);
    console.log(r.numero);
  }

  async function sendGuess(){
    setLoading(true);
    const response = await fetch(`http://localhost:8080/partita/${gameId}`, 
    {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({numero: guess})
    });
    const r = await response.json();
    setTries(r.tentativi);
    setResult(r.risultato);
    if(r.risultato === 0){
      setWon(true);
    }

    setLoading(false);
  }

  function handleGuess(e){
    setGuess(e.target.value);
  }

  function reset(){
    setStarted(false);
    setGameId(0);
    setLoading(false);
    setGuess(0);
    setTries(0);
    setResult(null);
    setWon(false);
  }

  return (
    <div className="App">
      {loading &&
        <p>loading...</p>
      }

      {!started && !loading &&
        <>
          <h1>avvia partita</h1>
          <button onClick={startGame}>avvia partita</button>
        </>
      }
      
      {
        started && !loading && !won &&
        <>
          <p>id:{gameId} </p>
            {tries > 0 &&
              <p>numero tentativi: {tries}</p> 
            }
          <input type="number" onChange={handleGuess}></input>
          <button onClick={sendGuess}>invia tentativo</button>
          <button onClick={reset}>arrenditi</button>
        </>
      }
      { !loading && started &&
        <>
          {
            result === -1 ? 
              <h1>numero troppo piccolo!!!</h1> 
              : 
              result === 1 ?
                <h1>numero troppo grande!!!</h1>
                :
                result === 0 ?
                <>
                  <h1>HAI INDOVINATO !!!!!</h1>
                  <p>ti ci sono voluti {tries} tentativi</p>
                  <button onClick={reset}>torna indietro</button>
                </>
                :
                <></>
          }
        </>
      }
    </div>
  );
}

export default App;
