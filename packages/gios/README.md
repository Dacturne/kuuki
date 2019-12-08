# `@kuuki/gios`
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)

`@kuuki/gios` is a simple api wrapper for GIOS written in TypeScript.

**GIOS** stands for (CHIEF INSPECTORATE FOR ENVIRONMENTAL PROTECTION).

This library provides the following functionality:
  - [x] Retrieve all measurement stations.
  - [x] Retrieve all measurement station sensors.
  - [x] Retrieve latest measurements of a sensor (up to 24h back) with time series granularity of 1 hour.
  - [ ] Retrieve air quality index for a station.

## About
This library focuses on providing a strictly typed API definition.

## Installation

`@kuuki/gios` requires [Node.js](https://nodejs.org/) to run on the backend.

```sh
$ npm install --save @kuuki/gios
```

## Usage
```javascript
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

## Documentation
Generated docs are placed in the root `/docs` folder, you can preview them [under this link](https://dacturne.github.io/kuuki/gios/), however the `d.ts` files should do just fine if you have your code editor and environment set up correctly.

## Gios API
The official API docs can be viewed at [Gios](https://powietrze.gios.gov.pl/pjp/content/api?lang=en).
