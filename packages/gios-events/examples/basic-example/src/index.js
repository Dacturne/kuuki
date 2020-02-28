const giosEvents = require("../../../dist"); // @kuuki/gios-events
const gios = require("../../../../gios/dist"); // @kuuki/gios

(async () => {
  const eventApi = new giosEvents.GiosAirQualityEventsService(
    new gios.GiosAirQualityService(),
    {
      stations: "*/15 * * * *", // every 10 minutes
      sensors: "*/15 * * * *",
      measurements: "*/5 * * * *"
    }
  );
  await eventApi.initialize();
  // any measurements that have never been registered and are not null
  eventApi.on("measurement", async (stationId, sensor, measurement) => {
    // find the station (to gather more metadata)
    const station = await eventApi.findStation(stationId);
    console.log({
      station,
      sensor,
      measurement,
      op: "insert"
    });
  })
  eventApi.on("measurement_update", async (stationId, sensor, measurement) => {
    // find the station (to gather more metadata)
    const station = await eventApi.findStation(stationId);
    console.log({
      station,
      sensor,
      measurement,
      op: "upsert"
    });
  })
})();

