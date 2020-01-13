const luftdaten = require("../../../luftdaten/dist");
const luftdatenEvents = require("../../dist");

const ld = new luftdaten.LuftdatenService();
const repo = new luftdatenEvents.MeasurementRepository();
const lde = new luftdatenEvents.LuftdatenEventsService(ld, repo);

(async () => {
  lde.track({
    getLatestMeasurements: {
      crontab: "* * * * * *" // fire an update every minute
    }
  });
  lde.on("measurement", m => {
    // save to db or some other stuff
    console.log([m.data.id, m.data.timestamp]);
    console.log(m);
  })
})();
