# basic-example

This is the most basic example of `@kuuki/gios` usage for GIOS API data retrieval.

## Installation
```sh
$ npm install
$ npm run start
```

## Usage summary
```javascript
// load the module
const gios = require("@kuuki/gios");

// use with async await
(async() => {
  const api = new gios.GiosAirQualityService();
  const measurements = await api.getMeasurements(88);
  console.log(measurements);
})();

// use with Promises
const api = new gios.GiosAirQualityService();
api.getMeasurements(88).then((measurements) => {
  console.log(measurements);
});
```
