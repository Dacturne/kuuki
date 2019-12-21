import { expect } from "chai";
import "mocha";
import fetchMock from "fetch-mock";
import { LuftdatenService } from "..";
import { MeasurementRaw } from "../lib/models/MeasurementRaw";
import { readFileSync } from "fs";
import DEFAULTS from "../lib/config";

describe("LuftdatenService", () => {
  const rawData = readFileSync(
    __dirname + "/responses/getLatestMeasurements.json"
  );
  const exampleMeasurements: MeasurementRaw[] = JSON.parse(rawData.toString());

  describe("Config should", () => {
    it("Not fail without passing an object", () => {
      const ld = new LuftdatenService();
    }).timeout(500);
    it("Not fail with an empty object config", () => {
      const ld = new LuftdatenService({})
    }).timeout(500);
    describe("Allow for custom paths", () => {
      Object.keys(DEFAULTS.API_PATHS).forEach(path => {
        it(`Accept a custom path [${path}]`, () => {
          const customPath = `http://example.org/custom/${path}`;
          const ld = new LuftdatenService({
            paths: { [path]: customPath }
          });
        }).timeout(500);
      })
    })
  });

  describe("Service should", () => {
    describe("Get latest measurements", () => {
      it("Retrieve getLatestMeasurements successfully", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_PATH, {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        await ld.getLatestMeasurements();
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurements successfully with a custom path", async () => {
        const customPath = "http://example.org/custom";
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(customPath, {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
          paths: { LATEST_MEASUREMENTS_PATH: customPath }
        });
        const measurements = await ld.getLatestMeasurements();
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);

      it("Return a properly mapped structure from getLatestMeasurements", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_PATH, {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        const measurements = await ld.getLatestMeasurements();
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);
    });

    describe("Get latest measurements filtered by sensor type", () => {
      it("Retrieve getLatestMeasurementsBySensorType successfully", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"type=SDS011", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        await ld.getLatestMeasurementsBySensorType("SDS011");
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurementsBySensorType successfully with a string parameter", async () => {
        const customPath = "http://example.org/customSensorType/";
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(customPath+"type=BME280", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
          paths: { LATEST_MEASUREMENTS_FILTERED_PATH: customPath }
        });
        await ld.getLatestMeasurementsBySensorType("BME280");
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurementsBySensorType successfully with an array parameter", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce("end:type=BME280,SDS011", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
        });
        await ld.getLatestMeasurementsBySensorType(["BME280", "SDS011"]);
        mockedFetch.reset();
      }).timeout(500);

      it("Return a properly mapped structure from getLatestMeasurementsBySensorType", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce("end:type=BME280", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch });
        const measurements = await ld.getLatestMeasurementsBySensorType("BME280");
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);
    });
  });
});
