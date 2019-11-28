// const gios = require("@kuuki/gios");
const gios = require("./../../../dist");

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
