import {fetchFiveDayForecast} from '../API';

const fetch = require('../../utils/fetch');

const API_URL = 'http://api.openweathermap.org/data/2.5';
const API_KEY = 'API_KEY';

jest.mock('../../config');

describe('fetchFiveDayForecast', () => {
  beforeEach(() => {
    spyOn(fetch, 'default').and.returnValue(Promise.resolve({
      json() { return {status: 200};}
    }));
  });

  it('makes request for city', () => {
    const promise = fetchFiveDayForecast('London');
    expect(fetch.default).toHaveBeenCalledWith(`${API_URL}/forecast?q=London&apikey=${API_KEY}`);

    return promise;
  });

  it('makes request for city and country', () => {
    const promise = fetchFiveDayForecast('London', 'UK');
    expect(fetch.default).toHaveBeenCalledWith(`${API_URL}/forecast?q=London,UK&apikey=${API_KEY}`);

    return promise;
  });

  it('makes request for city and country', () => {
    return fetchFiveDayForecast()
      .catch(err => {
        expect(err.message).toEqual('City required');
      })
  });
});
