const giosEvents = require("../../../dist"); // @kuuki/gios-events
const gios = require("../../../../gios/dist"); // @kuuki/gios

(async() => {
  const eventApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(),
    {
      stations: "*/10 * * * *", // every 10 minutes
      sensors: "*/10 * * * *",
      measurements: "*/2 * * * *"
    }
  );
  await eventApi.initialize();
  // any measurements that have never been registered and are not null
  eventApi.on("measurement", (stationId, sensor, measurement) => {
    console.log({
      sensor: sensor.identifier.id,
      val: measurement.value,
      op: "insert"
    });
  })
  // any measurements that have already been registered, but a change in value has occured
  eventApi.on("measurement_update", (stationId, sensor, measurement) => {
    console.log({
      sensor: sensor.identifier.id,
      val: measurement.value,
      op: "upsert"
    });
  })
})();
