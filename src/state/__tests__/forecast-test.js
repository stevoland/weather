import configureMockStore from 'redux-mock-store';
import startOfDay from 'date-fns/start_of_day';
import thunk from 'redux-thunk';

import forecastResponse from './forecast-response.json';

const API = require('../../services/API');

import reducer, {
  REQUEST_FORECAST,
  RECEIVE_FORECAST,
  REQUEST_FORECAST_FAILED,
  fetchForecast,
  requestForecast,
  receiveForecast,
  requestForecastFailed,
  getFiveDayForecast,
} from '../forecast';

const mockStore = configureMockStore([thunk]);


describe('state/forecast', () => {
  it('returns initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
        city: null,
        country: null,
        now: null,
        loading: false,
        loaded: false,
        loadedAt: null,
        response: {}
      });
  });

  it('returns request forecast action', () => {
    const payload = {
      city: 'London',
      country: 'UK',
      now: new Date()
    };

    expect(
      requestForecast(payload)
    ).toEqual({
        type: REQUEST_FORECAST,
        payload
      });
  });

  it('returns receive forecast action', () => {
    const payload = {
      city: 'London',
      country: 'UK',
      response: {
        data: {}
      },
      now: new Date()
    };

    expect(
      receiveForecast(payload)
    ).toEqual({
        type: RECEIVE_FORECAST,
        payload
      });
  });

  it('returns request forecast failed action', () => {
    const message = 'Failed';

    expect(
      requestForecastFailed(message)
    ).toEqual({
        type: REQUEST_FORECAST_FAILED,
        payload: new Error(message),
        error: true,
        meta: {
          flash: true
        }
      });
  });

  it('dispatches actions for successful forecast request', () => {
    const response = {data: {}};

    spyOn(API, 'fetchFiveDayForecast').and.returnValue(
      Promise.resolve(response)
    );

    const payload = {
      city: 'London',
      country: 'UK',
      now: Date.now()
    };

    const store = mockStore();

    return store.dispatch(fetchForecast(payload))
      .then(() => {
        expect(store.getActions()).toEqual([{
            type: REQUEST_FORECAST,
            payload
          }, {
            type: RECEIVE_FORECAST,
            payload: {
              ...payload,
              response
            }
          }])
      })
  });

  it('dispatches actions for failed forecast request', () => {
    const response = {message: 'Failed'};

    spyOn(API, 'fetchFiveDayForecast').and.returnValue(
      Promise.reject(response)
    );

    const payload = {
      city: 'London',
      country: 'UK',
      now: Date.now()
    };

    const store = mockStore();

    return store.dispatch(fetchForecast(payload))
      .then(() => {
        expect(store.getActions()).toEqual([{
            type: REQUEST_FORECAST,
            payload
          }, {
            type: REQUEST_FORECAST_FAILED,
            payload: new Error(response.message),
            error: true,
            meta: {
              flash: true
            }
          }])
      })
  });

  it('handles REQUEST_FORECAST action', () => {
    const now = Date.now();

    expect(reducer(undefined, {
      type: REQUEST_FORECAST,
      payload: {
        city: 'London',
        country: 'UK',
        now
      }
    })).toEqual({
      city: 'London',
      country: 'UK',
      now,
      today: startOfDay(now),
      loading: true,
      loaded: false,
      loadedAt: null,
      response: {}
    });
  });

  it('handles RECEIVE_FORECAST action', () => {
    const now = Date.now();

    expect(reducer(undefined, {
      type: RECEIVE_FORECAST,
      payload: {
        city: 'London',
        country: 'UK',
        now,
        response: {data: {}}
      }
    })).toEqual({
      city: 'London',
      country: 'UK',
      now,
      today: startOfDay(now),
      loading: false,
      loaded: true,
      loadedAt: now,
      response: {data: {}}
    });
  });

  it('converts forecast', () => {
    expect(
      getFiveDayForecast({
        forecast: {
          response: forecastResponse
        }
      })
    ).toEqual([
      {tempMin: 14, tempMax: 19, windSpeed: 17, windDir: 243, id: 500},
      {tempMin: 12, tempMax: 19, windSpeed: 14, windDir: 271, id: 800},
      {tempMin: 12, tempMax: 21, windSpeed: 11, windDir: 291, id: 800},
      {tempMin: 11, tempMax: 25, windSpeed: 12, windDir: 241, id: 800},
      {tempMin: 15, tempMax: 25, windSpeed: 16, windDir: 241, id: 801}]);
  });
});
