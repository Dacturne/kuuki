# `@kuuki`
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)

A project that aims to improve the accessibility to open data APIs in the environmental sector regarding air quality.

### Features
Gather measurements from multiple providers and data sources with the usage of strictly typed libraries.
React to events instead of manually polling external APIs.
Have everything in one place and easily configurable.
- type definitions
- listen to changes via events
- narrow down the requests to what suits your needs
- choose your own storage method (hook up an event consumer)

### Packages
- `@kuuki/gios` - a simple GIOS API wrapper
- `@kuuki/gios-events` - listen to changes in `gios`
- `@kuuki/luftdaten` - a simple Luftdaten API wrapper
- `@kuuki/luftdaten-events` - listen to changes in `luftdaten`
