import fetch from '../utils/fetch';
import {API_KEY} from '../config';

const API_URL = 'http://api.openweathermap.org/data/2.5';

export const fetchFiveDayForecast = (city, country) => {
  if (!city) {
    return Promise.reject(new Error('City required'));
  }

  const q = city + (country ? ',' + country : '');
  return fetch(`${API_URL}/forecast?q=${q}&apikey=${API_KEY}`);
}
