import { MeasurementRaw } from "./MeasurementRaw";
// Intersection type
export type MeasurementRowData = MeasurementRaw & {
  timeUuid: string;
};
