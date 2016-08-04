import addDays from 'date-fns/add_days';
import React, {Component, PropTypes} from 'react';

import Day from './Day';
import './FiveDayForecast.css';

class FiveDayForecast extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    today: PropTypes.instanceOf(Date)
  }

  _renderDay(data, index) {
    const {today} = this.props;
    const date = addDays(today, index);
    return <Day data={data} date={date} key={date} />;
  }

  render() {
    const {data} = this.props;
    return (
      <div className="FiveDayForecast">
        {data.map(this._renderDay, this)}
      </div>
    );
  }
}

export default FiveDayForecast;
