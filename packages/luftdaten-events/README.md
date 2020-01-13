# `@kuuki/luftdaten-events`
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)

`kuuki/luftdaten-events` is an event based API wrapper for Luftdaten, written in TypeScript.

More info on Luftdaten APIs [here](https://github.com/opendata-stuttgart/meta/wiki/APIs).

This library provides the following functionality:
- [x] Load the state from a leveldb automatically.
- [x] Poll API endpoints with a crontab setting.
- [x] Retrieve all latest (5min) measurements.
- [x] Retrieve all latest measurements with `sensor type` filter.
- [x] Retrieve all latest measurements with `area` filter.
- [x] Retrieve all latest measurements with `box` filter.
- [x] Retrieve all latest measurements with `country` filter.
- [x] Retrieve an average of all latest measurements of a sensor (5min).
- [x] Retrieve an average of all measurements of a sensor (1h).
- [x] Retrieve an average of all measurements of a sensor (24h).
- [x] Strictly typed models.

Provided events:
- [x] measurement - Emitted when a unique measurement has been registered.
- [ ] log - TODO
- [ ] error - TODO

## About
This library focuses on providing a strictly type API definition and acces to `EventEmitter`, exposing further functionality. What's happening under the hood is, that the state is stored in LevelDB and updated once in a while, emitting a `measurement` event to the listeners on each unique measurement insert operation.

If you only need something simple - check out [`@kuuki/lufdaten`](https://https://github.com/Dacturne/kuuki/tree/master/packages/luftdaten).

## Installation
`@kuuki/luftdaten-events` requires [Node.js](https://nodejs.org/) to run on the backend.

```sh
$ npm install --save @kuuki/luftdaten @kuuki/luftdaten-events
```

## Usage
```javascript
const luftdaten = require("@kuuki/luftdaten");
const luftdatenEvents = require("@kuuki/luftdaten-events");

const ld = new luftdaten.LuftdatenService();
const repo = new luftdatenEvents.MeasurementRepository();
const lde = new luftdatenEvents.LuftdatenEventsService(ld, repo);

(async () => {
  lde.track({ // insert only the endpoints you want to poll for
    getLatestMeasurements: {
      crontab: "* * * * * *" // fire an update every minute
      // ...other args if needed
    }
  });
  lde.on("measurement", m => {
    // save to db or some other stuff
    console.log([m.data.id, m.data.timestamp]);
    console.log(m);
  })
})();
```

## Documentation
Generated docs are placed in the root `/docs` folder, you can preview them [under this link](https://dacturne.github.io/kuuki/luftdaten-events/), however the `d.ts` files should do just fine if you have your code editor and environment set up correctly.
