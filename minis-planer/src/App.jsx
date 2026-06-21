import { useState } from 'react'
import './App.css'
import EintragsTabelle from './tabelle.jsx';

function BannerTop({ gemeinde }) {
  return(
    <div>
      <h1>Minis-planer</h1>
      <p>Pastoralraum – Gemeinde: {gemeinde}</p>
    </div>
  )
}

// Wir übergeben username und setUsername als "Props" von der App-Komponente
function UsernameInput({ username, setUsername }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <label htmlFor="username" style={{ marginRight: '10px', fontWeight: 'bold' }}>Dein Name: </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Vor- und Nachname"
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
      />
    </div>
  );
}

function App() {
  // Der State für den Namen wohnt jetzt hier ganz oben
  const [username, setUsername] = useState('');
  const gemeinde = "Ober-Olm";

  return (
    <>
      <BannerTop gemeinde={gemeinde} />
      <UsernameInput username={username} setUsername={setUsername} />
      
      {/* Die Tabelle bekommt den aktuellen Namen als Prop mitgeliefert */}
      <EintragsTabelle username={username} />
    </>
  )
}

export default App