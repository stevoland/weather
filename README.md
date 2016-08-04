# Weather

## Demo

[http://peaceful-peak-87461.herokuapp.com/](http://peaceful-peak-87461.herokuapp.com/)

## Run tests

```
npm install
npm test
```

## Run dev server

```
npm install
npm run start
```

## Build for production

```
npm install
npm run build
```

# TODO

Improvements with more time:

- [ ] Display flash message on error of fetching forecast
- [ ] Test `getTodayForecast` selector
- [ ] Test component rendering with Jest snapshots
- [ ] Tweak algorithm for choosing day's average icon (weight towards extreme weather?)
- [ ] More accessible markup
- [ ] Proper layout and styling (responsive)
- [ ] Wind icon showing direction
- [ ] Configurable units: C/F, mph/kph
- [ ] Change icon based on day/night
- [ ] Convert icons to SVGs (hate icon fonts!)
