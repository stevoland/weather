import icons from '../constants/icons.json';

export const kelvinToCelcius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

export const mpsToMph = (mps) => {
  return Math.round(mps * 2.236936);
};

// From: https://gist.github.com/tbranyen/62d974681dea8ee0caa1
export const getIconClass = (id) => {
  let icon = icons[id] && icons[id].icon;

  if (!icon) {
    return null;
  }

  if (!(id > 699 && id < 800) && !(id > 899 && id < 1000)) {
    icon = 'day-' + icon;
  }

  return 'wi wi-' + icon;
}
