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
  const getTemp = async () => {
    // authenticate
    if (isNaN(props.input.value) === true) {
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
      return ['error', 'New number, what dis?'];
    }
    if (props.input.value.length !== 5) {
      return ['error', 'Zip codes are 5 digits'];
    }
    if (!validateZip(props.input.value)) {
      return ['error', 'Invalid zip code']
    }

    // loading
    setWeather(<div>Loading...</div>);

    // Main function
    const locUrl = `https://geocode.xyz/${props.input.value}?region=US&json=1`;
    const latLon = async (locUrl) => {
      const ll = await post(locUrl);
      let locTime = { loc: ll, time: Object };
      //   data throttle on geocode is 2 requests per second, so if throttled wait for a sec.
      // addendum: throttle isn't consistantly one second as advertised... seems to vary. 3 secs seems like a safe bet, but code won't break even if it's longer.
      // Put in the wrong zip code, and the api won't give an error message... Which means I need to make a better authentication system
      if (ll.error) {
        // delay converts setTimout into a promise that can be "awaited". Which means can work with other async functions.
        const delay = (ms) => {
          return new Promise((resolve) => setTimeout(resolve, ms));
        };
        await delay(3000);
        locTime = await latLon(locUrl);
      } else {
        // If there is an error the else block will run in the callback, but not on the original call since ll.error=True when checked.
        const timeUrl = `https://api.ipgeolocation.io/timezone?apiKey=${geolocation}&lat=${ll.latt}&long=${ll.longt}`;
        locTime.time = await post(timeUrl);
      }
      return locTime;
    };
    // get all variables needed for weather information
    const locTime = await latLon(locUrl);
    console.log(locTime);
    // find the high and low
    const tempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locTime.loc.latt}&longitude=${locTime.loc.longt}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=${locTime.time.timezone}&start_date=${locTime.time.date}&end_date=${locTime.time.date}`;
    const temp = await post(tempUrl);
    setWeather(
      <div>
        {' '}
        The high for today is {temp.daily.temperature_2m_max}&deg;F. The low is{' '}
        {temp.daily.temperature_2m_min}&deg;F.
      </div>
    );
  };
  return (
    <div>
      <input type="button" value="Submit" id="submit" onClick={getTemp} />
      {weather}
    </div>
  );
};
export default Weather;
