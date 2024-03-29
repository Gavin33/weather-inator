import { useState } from 'react';
import validateZip from './zip/validateZip';

// key for geolocation api
const geolocation = '10a4485a538c4751a5c40c516997d3a5';

// code could be used for any request, but we're primarily if not solely using post.
const post = async (weatherUrl) => {
  const response = await fetch(weatherUrl);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
};

const Weather = (props) => {
  const [weather, setWeather] = useState(<div />);
  let [attempts, setAttempt] = useState(0);
  const getTemp = async () => {
    // authenticate
    const authenticate = (input) => {
      if (!input) {
        setWeather(<div class="output">Please enter a zip code</div>);
      } else if (isNaN(input)) {
        // test code for zip verification
        /*       for (let i = 0; i < validZip.length; i++) {
        const zip = validateZip(validZip[i]);
        console.log(validZip[i]);
        console.log(zip);
        if (!zip) {
          break;
        }
      }
      for (let i = 0; i < invalidZip.length; i++) {
        const zip = validateZip(invalidZip[i]);
        console.log(invalidZip[i]);
        console.log(zip);
        if (zip) {
          break;
        }
      } */
        setWeather(<div class="output">New number wat dis?</div>);
      } else if (input.length !== 5) {
        setWeather(
          <div class="output">Only 5 digit zip codes are supported</div>
        );
      } else if (!validateZip(input)) {
        setWeather(<div class="output">Invalid zip</div>);
      } else {
        return true;
      }
      return false;
    };

    // loading
    setWeather(<div>Loading...</div>);
    if (authenticate(props.input.value)) {
      // Main function
      const locUrl = `https://geocode.xyz/${props.input.value}?region=US&json=1`;
      const latLon = async (locUrl) => {
        if (attempts !== 10) {
          const ll = await post(locUrl);
          let locTime = { loc: ll, time: Object };
          //   data throttle on geocode is 2 requests per second, so if throttled wait for a sec.
          // addendum: throttle isn't consistantly one second as advertised... seems to vary. 3 secs seems like a safe bet, but code won't break even if it's longer.
          if (ll.error) {
            // delay converts setTimout into a promise that can be "awaited". Which means can work with other async functions.
            const delay = (ms) => {
              return new Promise((resolve) => setTimeout(resolve, ms));
            };
            await delay(3000);
            // Avoid an endless loop if reach daily request limit
            setAttempt(attempts++);
            locTime = await latLon(locUrl);
          } else {
            // If there is an error the else block will run in the callback, but not on the original call since ll.error=True when checked.
            const timeUrl = `https://api.ipgeolocation.io/timezone?apiKey=${geolocation}&lat=${ll.latt}&long=${ll.longt}`;
            locTime.time = await post(timeUrl);
          }
          return locTime;
        }
        return false;
      };
      // get all variables needed for weather information
      const locTime = await latLon(locUrl);
      if (locTime) {
        // find the high and low
        const tempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locTime.loc.latt}&longitude=${locTime.loc.longt}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=${locTime.time.timezone}&start_date=${locTime.time.date}&end_date=${locTime.time.date}`;
        const temp = await post(tempUrl);
        setWeather(
          <div class="output">
            {' '}
            The high for today is {temp.daily.temperature_2m_max}&deg;F. The low
            is {temp.daily.temperature_2m_min}&deg;F.
          </div>
        );
      } else {
        // If 10 unsuccessful fetches occur, timeout.
        setWeather(
          <div class="output">
            A repeated error occured while attempting to locate your zip code.
            Please try again a little later.
          </div>
        );
      }
    }
  };
  return (
    <div>
      <input type="button" value="Submit" id="submit" onClick={getTemp} />
      {weather}
    </div>
  );
};
export default Weather;
