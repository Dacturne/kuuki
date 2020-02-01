[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)
[![Coverage Status](https://coveralls.io/repos/github/Dacturne/kuuki/badge.svg?branch=master)](https://coveralls.io/github/Dacturne/kuuki?branch=master)

<p align="center"><img src="./../../kuuki.svg" width="150" alt="Kuuki logo"></p>
<h1 align="center"><pre>@kuuki/luftdaten</pre></h1>

`kuuki/luftdaten` is a simple API wrapper for Luftdaten, written in TypeScript.

More info on Luftdaten APIs [here](https://github.com/opendata-stuttgart/meta/wiki/APIs).

This library provides the following functionality:
- [x] Retrieve all latest (5min) measurements.
- [x] Retrieve all latest measurements with `sensor type` filter.
- [x] Retrieve all latest measurements with `area` filter.
- [x] Retrieve all latest measurements with `box` filter.
- [x] Retrieve all latest measurements with `country` filter.
- [x] Retrieve an average of all latest measurements of a sensor (5min).
- [x] Retrieve an average of all measurements of a sensor (1h).
- [x] Retrieve an average of all measurements of a sensor (24h).
- [x] Strictly typed models.

## About
This library focuses on providing a strictly typed API wrapper.
If you need something more sophisticated - check out [`@kuuki/lufdaten-events`](https://https://github.com/Dacturne/kuuki/tree/master/packages/luftdaten-events), that exposes `EventEmitter` and emits events accordingly.

## Installation
`@kuuki/luftdaten` requires [Node.js](https://nodejs.org/) to run on the backend.

```sh
$ npm install --save @kuuki/luftdaten
```

## Usage
```javascript
const luftdaten = require("@kuuki/luftdaten");

const ld = new luftdaten.LuftdatenService();

(async () => {
  const measurements = await ld.getLatestMeasurements();
  measurements.forEach(m => {
    console.log(m)
  });
})();
```

## Documentation
Generated docs are placed in the root `/docs` folder, you can preview them [under this link](https://dacturne.github.io/kuuki/luftdaten-events/), however the `d.ts` files should do just fine if you have your code editor and environment set up correctly.
