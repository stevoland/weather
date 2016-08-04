import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';

import {city, country} from '../config';
import {fetchForecast, getFiveDayForecast, getTodayForecast} from '../state/forecast';
import FiveDayForecast from './FiveDayForecast';
import TodayForecast from './TodayForecast';
import './App.css';

export class PlainApp extends Component {
  propTypes: {
    city: PropTypes.string,
    country: PropTypes.country,
    days: PropTypes.array,
    fetchForecast: PropTypes.func.isRequired,
    today: PropTypes.any
  }

  componentDidMount() {
    this.props.fetchForecast({
      city,
      country,
      now: Date.now()
    });
  }

  render() {
    const {city, country, daysForecast, loaded, now, today, todayForecast} = this.props;

    let title = city;
    if (country) {
      title += ', ' + country;
    }

    return (
      <div className="App">
        <h1 className="App__title">{title}</h1>
        <TodayForecast now={now} data={todayForecast} loaded={loaded} />
        <FiveDayForecast today={today} data={daysForecast} />
      </div>
    );
  }
}

export default connect(state => ({
    city: state.forecast.city,
    country: state.forecast.country,
    daysForecast: getFiveDayForecast(state),
    todayForecast: getTodayForecast(state),
    loaded: state.forecast.loaded,
    now: state.forecast.now,
    today: state.forecast.today
  }), {
    fetchForecast
  }
)(PlainApp);
