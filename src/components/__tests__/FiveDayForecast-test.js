import React from 'react';
import renderer from 'react-test-renderer';

import FiveDayForecast from '../FiveDayForecast';

describe('FiveDayForecast', () => {

  // TODO: Add snapshot tests for components
  xit('renders correctly', () => {
    const tree = renderer.create(
        <FiveDayForecast days={[]} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
  });
});
