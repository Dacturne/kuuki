/**
 * @example
 * [{
 *   "id": 92,
 *   "stationId": 14,
 *   "param": {
 *       "paramName": "pył zawieszony PM10",
 *       "paramFormula": "PM10",
 *       "paramCode": "PM10",
 *       "idParam": 3
 *   }
 * },
 * {
 *     "id": 88,
 *     "stationId": 14,
 *     "param": {
 *         "paramName": "dwutlenek azotu",
 *         "paramFormula": "NO2",
 *         "paramCode": "NO2",
 *         "idParam": 6
 *     }
 * }]
 */
export type MeasurementStationSensorRaw = {
  id: number;
  stationId: number;
  param: {
    paramName: string;
    paramFormula: string;
    paramCode: string;
    idParam: number;
  };
};
