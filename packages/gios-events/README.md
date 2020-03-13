[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)

<p align="center"><img src="./../../kuuki.svg" width="150" alt="Kuuki logo"></p>
<h1 align="center"><pre>@kuuki/gios-events</pre></h1>

`@kuuki/gios-events` is an event based api wrapper for GIOS written in TypeScript.

**GIOS** stands for (CHIEF INSPECTORATE FOR ENVIRONMENTAL PROTECTION).

This library provides the following functionality:
  - [x] Load the state from the API.
  - [x] Retrieve all measurement stations from the local state.
  - [x] Retrieve all measurement station sensors from the local state.
  - [x] Retrieve latest measurements of a sensor (up to 62h back) with time series granularity of 1 hour (from the local state).
  - [ ] Retrieve air quality index for a station.

Provided events:
  - [x] `stations_refreshed` - Stations refreshed event.
  - [x] `station_joined` - New station joined event.
  - [x] `station_left` - Station left event.
  - [x] `sensors_refreshed` - Sensors refreshed event.
  - [x] `sensor_joined` - New sensor joined event.
  - [x] `sensor_left` - Sensor left event.
  - [x] `data_refreshed` - Measurement data refreshed event.
  - [x] `data` - Raw data being processed and classified.
  - [x] `measurement` - New and valid (not `null` and never registed in local state) measurement event.
  - [x] `measurement_update` - Measurement update event (Any measurement could change after a while. Check GIOS docs for further details).
  - [ ] `error` - TODO

## About
This library focuses on providing a strictly typed API definition and access to `EventEmitter`, exposing further functionality.
What's basically happening is, that the state is stored locally and updated once in a while, providing you with highly flexible events, that you can attach event listeners to.
If you need something less sophisticated, check out [`@kuuki/gios`](https://dacturne.github.io/kuuki/gios/).

## Installation

`@kuuki/gios` requires [Node.js](https://nodejs.org/) to run on the backend.

```sh
$ npm install --save @kuuki/gios @kuuki/gios-events
```

## Usage
```javascript
(async() => {
  const eventApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(),
    {
      stations:     "*/15 * * * *", // every 15 minutes
      sensors:      "*/15 * * * *",
      measurements: "*/5 * * * *"
    }
  );
  await eventApi.initialize();
  // any measurements that have never been registered and are not null
  eventApi.on("measurement", (stationId, sensor, measurement) => {
    // find the station (to gather more metadata)
    const station = eventApi.findStation(stationId);
    console.log({
      station,
      sensor,
      measurement,
      op: "insert"
    });
  })
  eventApi.on("measurement_update", (stationId, sensor, measurement) => {
    // find the station (to gather more metadata)
    const station = eventApi.findStation(stationId);
    console.log({
      station,
      sensor,
      measurement,
      op: "upsert"
    });
  })
})();
```

## Documentation
Generated docs are placed in the root `/docs` folder, you can preview them [under this link](https://dacturne.github.io/kuuki/gios-events/), however the `d.ts` files should do just fine if you have your code editor and environment set up correctly.

## Gios API
The official API docs can be viewed at [Gios](https://powietrze.gios.gov.pl/pjp/content/api?lang=en).
