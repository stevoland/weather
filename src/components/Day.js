import cx from 'classnames';
import format from 'date-fns/format';
import React, {Component, PropTypes} from 'react';

import {getIconClass} from '../utils/convert';
import './Day.css';

export default class Day extends Component {
  static propTypes = {
    data: PropTypes.shape({
      tempMin: PropTypes.number,
      tempMax: PropTypes.number
    }),
    date: PropTypes.instanceOf(Date)
  }

  render() {
    const {date, data} = this.props;

    const tempMax = data.tempMax ? data.tempMax + '°C' : null;
    const tempMin = data.tempMin ? data.tempMin + '°C' : null;
    const iconClass = data.id ? getIconClass(data.id) : null;

    return (
      <div className="Day">
        <span className="Day__day">{format(date, 'ddd')}</span>
        <span className={cx("Day__icon", iconClass)}></span>
        <span className="Day__tempMax">{tempMax}</span>
        <span className="Day__tempMin">{tempMin}</span>
      </div>
    );
  }
}
