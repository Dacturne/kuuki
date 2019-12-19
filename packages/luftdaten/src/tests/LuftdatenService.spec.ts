import { expect } from "chai";
import "mocha";
import fetchMock from "fetch-mock";
import { LuftdatenService } from "..";
import { MeasurementRaw } from "../lib/models/MeasurementRaw";
import { readFileSync } from "fs";

describe("LuftdatenService", () => {
  const rawData = readFileSync(
    __dirname + "/responses/getLatestMeasurements.json"
  );
  const exampleMeasurements: MeasurementRaw[] = JSON.parse(rawData.toString());
  const mockedFetch = fetchMock
    .sandbox()
    .mock("https://data.sensor.community/static/v1/data.json", {
      status: 200,
      body: exampleMeasurements,
    });

  describe("Should", () => {
    it("Retrieve getLatestMeasurements successfully", async () => {
      const ld = new LuftdatenService(mockedFetch);
      await ld.getLatestMeasurements();
    }).timeout(500);

    it("Return a properly mapped structure from getLatestMeasurements", async () => {
      const ld = new LuftdatenService(mockedFetch);
      const measurements = await ld.getLatestMeasurements();
      expect(JSON.stringify(measurements)).to.equal(
        JSON.stringify(exampleMeasurements)
      );
    }).timeout(500);
  });
});
