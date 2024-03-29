import './App.css';
import Weather from "./components/Weather.js"
import {useState} from 'react'

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange,
  };
}

function App() {
  const inputProps = useInput();
  return (
    <div className="App">
      <h1 class="blue">The Weather-Inator</h1>
      <label for="zip" class="">Please enter a zip code.</label>
      <input
        type="text"
        id="zip"
        name="zip"
        placeholder="Zip Code"
        {...inputProps}
      />
      <Weather input={inputProps}/>
    </div>
  );
}

export default App;
