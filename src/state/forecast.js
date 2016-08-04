import {createSelector} from 'reselect';
import {mode} from 'numbers/lib/numbers/statistic';
import isAfter from 'date-fns/is_after';
import startOfDay from 'date-fns/start_of_day';

import {fetchFiveDayForecast} from '../services/API';
import {kelvinToCelcius, mpsToMph} from '../utils/convert';

export const REQUEST_FORECAST = 'REQUEST_FORECAST';
export const RECEIVE_FORECAST = 'RECEIVE_FORECAST';
export const REQUEST_FORECAST_FAILED = 'REQUEST_FORECAST_FAILED';

const INITIAL_STATE = {
  city: null,
  country: null,
  now: null,
  loading: false,
  loaded: false,
  loadedAt: null,
  response: {}
};


const getDateFromSeconds = (seconds) => {
  return seconds * 1000;
};

const sanitizeData = (data) => {
  const cleanData = {
    ...data
  };

  if (cleanData.temp != null) {
    cleanData.temp = kelvinToCelcius(cleanData.temp);
  }

  if (cleanData.tempMin != null) {
    cleanData.tempMin = kelvinToCelcius(cleanData.tempMin);
  }

  if (cleanData.tempMax != null) {
    cleanData.tempMax = kelvinToCelcius(cleanData.tempMax);
  }

  if (cleanData.windSpeed != null) {
    cleanData.windSpeed = mpsToMph(cleanData.windSpeed);
  }

  if (cleanData.windDir != null) {
    cleanData.windDir = Math.round(cleanData.windDir);
  }

  return cleanData;
}

// convert array of forecast objects for one day
// into one normalized object representing that day
// TODO: improve algorithm for choosing weather summary
const listItemsToDay = (items) => {
  let tempMin;
  let tempMax;
  let windSpeed;
  let windDir;

  items.forEach(item => {
    tempMin = tempMin == null ? item.main.temp_min : Math.min(item.main.temp_min, tempMin);
    tempMax = tempMax == null ? item.main.temp_max : Math.max(item.main.temp_max, tempMax);

    if (windSpeed == null || item.wind.speed > windSpeed ) {
      windSpeed = item.wind.speed;
      windDir = item.wind.deg;
    }
  });

  const ids = items
    .filter(item => item.weather && item.weather.length && item.weather[0].id)
    .map(item => item.weather[0].id);

  return sanitizeData({
    tempMin,
    tempMax,
    windSpeed,
    windDir,
    id: mode(ids)
  });
}

// Convert array of forecast objects every 3 hours into
// array of objects, each representing 1 day
const listToDays = (list) => {
  const itemsByDay = {};

  list.forEach(item => {
    const dayKey = startOfDay(getDateFromSeconds(item.dt));

    if (!itemsByDay[dayKey]) {
      itemsByDay[dayKey] = [];
    }

    itemsByDay[dayKey].push(item);
  });

  return Object.keys(itemsByDay).map(key => {
    return listItemsToDay(itemsByDay[key]);
  });
}

const forecastResponseSelector = state => state.forecast.response;
const nowSelector = state => state.forecast.now;

export const getFiveDayForecast = createSelector(
  forecastResponseSelector,
  (response) => {
    if (!response || !response.list) {
      return [];
    }
    return listToDays(response.list);
  }
);

export const getTodayForecast = createSelector(
  [forecastResponseSelector, nowSelector],
  (response, now) => {
    if (!response || !response.list) {
      return {};
    }

    let forecast = {};

    response.list.some(item => {
      const date = getDateFromSeconds(item.dt);

      if (isAfter(date, now)) {
        if (item.main) {
          forecast.temp = item.main.temp;
        }

        if (item.wind) {
          forecast.windSpeed = item.wind.speed;
          forecast.windDir = item.wind.deg;
        }

        if (item.weather && item.weather.length) {
          forecast.id = item.weather[0].id;
          forecast.label = item.weather[0].description;
        }

        return true;
      }

      return false;
    });

    return sanitizeData(forecast);
  }
)

export default function forecastReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_FORECAST:
      return {
        ...state,
        loading: true,
        city: action.payload.city,
        country: action.payload.country,
        now: action.payload.now,
        today: startOfDay(action.payload.now)
      };

    case RECEIVE_FORECAST:
      return {
        ...state,
        city: action.payload.city,
        country: action.payload.country,
        now: action.payload.now,
        today: startOfDay(action.payload.now),
        loading: false,
        loaded: true,
        loadedAt: action.payload.now,
        response: action.payload.response
      };

    default:
      return state;
  }
}

export default forecastReducer;

export const requestForecast = ({city, country, now}) => {
  return {
    type: REQUEST_FORECAST,
    payload: {
      city,
      country,
      now
    }
  };
};

export const receiveForecast = ({city, country, response, now}) => {
  return {
    type: RECEIVE_FORECAST,
    payload: {
      city,
      country,
      response,
      now
    }
  };
};

export const requestForecastFailed = (message) => {
  return {
    type: REQUEST_FORECAST_FAILED,
    payload: new Error(message),
    error: true,
    meta: {
      flash: true
    }
  }
};

export const fetchForecast = ({city, country, now}) => {
  return dispatch => {
    dispatch(
      requestForecast({
        city,
        country,
        now
      })
    );

    return fetchFiveDayForecast(city, country)
      .then(response => {
        dispatch(
          receiveForecast({city, country, response, now})
        );
      })
      .catch(response => {
        dispatch(requestForecastFailed(response.message));
      })
  };
};
