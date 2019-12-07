const giosEvents = require("../../../dist"); // @kuuki/gios-events
const gios = require("../../../../gios/dist"); // @kuuki/gios

// (async () => {
//   const eventsApi = new giosEvents.GiosAirQualityEventsService(
//     new gios.GiosAirQualityService(), {
//     // #             ┌───────────────── second (optional)
//     // #             │    ┌──────────── minute
//     // #             │    │    ┌────────── hour
//     // #             │    │    │    ┌──────── day of month
//     // #             │    │    │    │    ┌────── month
//     // #             │    │    │    │    │    ┌──── day of week
//     // #             │    │    │    │    │    │
//     // #             │    │    │    │    │    │
//     // #             *    *    *    *    *    *
//     stations:     "     */5    *    *    *    *",
//     sensors:      "     */5    *    *    *    *",
//     measurements: "*/30   *    *    *    *    *"
//   }
//   );
//   await eventsApi.initialize();
//   eventsApi.on("data", (station, sensor, data) => {
//     if (data.values && data.values[0] && data.values[0].value != null) {
//       // console.log(sensor.identifier.id);
//     } else {
//       console.log(`problematic measurement on sensor: ${sensor.identifier.id}`)
//     }
//   })
// })();

(async() => {
  const eventApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(),
    {
      stations: "*/10 * * * *",
      sensors: "*/10 * * * *",
      measurements: "*/5 * * * *"
    }
  );
  await eventApi.initialize();
  eventApi.on("measurement", (stationId, sensor, measurement) => {
    console.log({
      sensor: sensor.identifier.id,
      val: measurement.value
    });
  })
  eventApi.on("measurement_update", (stationId, sensor, measurement) => {
    console.log({
      sensor: sensor.identifier.id,
      val: measurement.value,
      fixed: true
    });
  })
})();
