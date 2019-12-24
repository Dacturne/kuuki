import { expect, assert } from "chai";
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

      it("Reject promise if an empty array was passed as a parameter", async () => {
        const mockedFetch = fetchMock
        .sandbox()
        .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"type=", {
          status: 200,
          body: exampleMeasurements
        });
        const ld = new LuftdatenService({ fetch: mockedFetch });
        try {
          await ld.getLatestMeasurementsBySensorType([]);
          assert.fail("was supposed to fail");
        } catch(error) {
          expect(error).to.equal("Empty array passed to query");
        }
        mockedFetch.reset();
      }).timeout(500);
    });

    describe("Get latest measurements filtered by box", () => {
      it("Retrieve getLatestMeasurementsByBox successfully", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"box=52.1,13.1,53.5,13.5", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        await ld.getLatestMeasurementsByBox(52.1, 13.1, 53.5, 13.5);
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurementsByBox successfully with a custom path", async () => {
        const customPath = "http://example.org/customBox/";
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(customPath+"box=52.1,13.1,53.5,13.5", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
          paths: { LATEST_MEASUREMENTS_FILTERED_PATH: customPath }
        });
        await ld.getLatestMeasurementsByBox(52.1, 13.1, 53.5, 13.5);
        mockedFetch.reset();
      }).timeout(500);

      it("Return a properly mapped structure from getLatestMeasurementsByBox", async () => {
        const mockedFetch = fetchMock
          .sandbox().reset()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"box=52.1,13.1,53.5,13.5", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        const measurements = await ld.getLatestMeasurementsByBox(52.1, 13.1, 53.5, 13.5);
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);
    });

    describe("Get latest measurements filtered by area", () => {
      it("Retrieve getLatestMeasurementsByArea successfully", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"area=52.1,13.1,10", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        await ld.getLatestMeasurementsByArea(52.1, 13.1, 10);
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurementsByArea successfully with a custom path", async () => {
        const customPath = "http://example.org/customArea/";
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(customPath+"area=52.1,13.1,10", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
          paths: { LATEST_MEASUREMENTS_FILTERED_PATH: customPath }
        });
        await ld.getLatestMeasurementsByArea(52.1, 13.1, 10);
        mockedFetch.reset();
      }).timeout(500);

      it("Return a properly mapped structure from getLatestMeasurementsByArea", async () => {
        const mockedFetch = fetchMock
          .sandbox().reset()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"area=52.1,13.1,10", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        const measurements = await ld.getLatestMeasurementsByArea(52.1, 13.1, 10);
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);
    });

    describe("Get latest measurements filtered by country", () => {
      it("Retrieve getLatestMeasurementsByArea successfully", async () => {
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"country=PL", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        await ld.getLatestMeasurementsByCountry("PL");
        mockedFetch.reset();
      }).timeout(500);

      it("Retrieve getLatestMeasurementsByArea successfully with a custom path", async () => {
        const customPath = "http://example.org/customCountry/";
        const mockedFetch = fetchMock
          .sandbox()
          .getOnce(customPath+"country=PL", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({
          fetch: mockedFetch as any,
          paths: { LATEST_MEASUREMENTS_FILTERED_PATH: customPath }
        });
        await ld.getLatestMeasurementsByCountry("PL");
        mockedFetch.reset();
      }).timeout(500);

      it("Return a properly mapped structure from getLatestMeasurementsByArea", async () => {
        const mockedFetch = fetchMock
          .sandbox().reset()
          .getOnce(DEFAULTS.API_PATHS.LATEST_MEASUREMENTS_FILTERED_PATH+"country=PL", {
            status: 200,
            body: exampleMeasurements,
          });
        const ld = new LuftdatenService({ fetch: mockedFetch as any });
        const measurements = await ld.getLatestMeasurementsByCountry("PL");
        expect(JSON.stringify(measurements)).to.equal(
          JSON.stringify(exampleMeasurements)
        );
        mockedFetch.reset();
      }).timeout(500);
    });
  });
});
