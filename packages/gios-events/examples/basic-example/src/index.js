const giosEvents = require("../../../dist"); // @kuuki/gios-events
const gios = require("../../../../gios/dist"); // @kuuki/gios

(async () => {
  const eventsApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(), {
    // #             ┌───────────────── second (optional)
    // #             │    ┌──────────── minute
    // #             │    │    ┌────────── hour
    // #             │    │    │    ┌──────── day of month
    // #             │    │    │    │    ┌────── month
    // #             │    │    │    │    │    ┌──── day of week
    // #             │    │    │    │    │    │
    // #             │    │    │    │    │    │
    // #             *    *    *    *    *    *
    stations:     "     */5    *    *    *    *",
    sensors:      "     */5    *    *    *    *",
    measurements: "*/30   *    *    *    *    *"
  }
  );
  await eventsApi.initialize();
  eventsApi.on("sensor_data", (station, sensor, data) => {
    if (data.values[0].value == null)
      console.log(sensor.identifier.id);
  })
})();
