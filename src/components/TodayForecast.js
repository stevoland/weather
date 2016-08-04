import cx from 'classnames';
import React, {Component, PropTypes} from 'react';

import {getIconClass} from '../utils/convert';
import Spinner from './Spinner';
import './TodayForecast.css';

class TodayForecast extends Component {
  static propTypes = {
    data:  PropTypes.object,
    loaded: PropTypes.bool,
    now: PropTypes.number
  }

  render() {
    const {data, loaded} = this.props;

    const label = data.label ? data.label : null;
    const icon = data.id ? getIconClass(data.id) : null;
    const temp = data.temp ? data.temp + '°C' : null;

    return (
      <div className="TodayForecast">
        <h2 className="TodayForecast__label">{label}</h2>
        <div className={cx('TodayForecast__icon', icon)}></div>
        {!loaded && <div className="TodayForecast__spinner">
          <Spinner />
        </div>}
        <div className="TodayForecast__temp">{temp}</div>
      </div>
    );
  }
}

export default TodayForecast;
