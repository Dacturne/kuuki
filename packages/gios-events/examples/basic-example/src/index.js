const giosEvents = require("../../../dist"); // @kuuki/gios-events
const gios = require("../../../../gios/dist"); // @kuuki/gios

(async() => {
  const eventApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(),
    {
      stations:     "*/10 * * * *", // every 10 minutes
      sensors:      "*/10 * * * *",
      measurements: "*/2 * * * *"
    }
  );
  await eventApi.initialize();
  // any measurements that have never been registered and are not null
  eventApi.on("measurement", (stationId, sensor, measurement) => {
    // find the station (to gather more metadata)
    const station = eventApi.findStation(stationId);
    console.log({
      stationId,
      sensor,
      measurement,
      op: "insert"
    });
  })
})();
