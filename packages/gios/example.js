// const GiosService = require("@kuuki/gios");
const GiosService = require("./dist");
(async() => {
    const api = new GiosService();
    const stations = await api.getStations();
    console.log("Station: ", stations)
    const sensors = await api.getSensors(stations[0].id);
    const measurements = await api.getMeasurements(sensors[0].id);
})();
