/**
 * Format of the data acquired from measurement stations resource
 *
 * @example
 * [{
 *   "id": 14,
 *   "stationName": "Działoszyn",
 *   "gegrLat": "50.972167",
 *   "gegrLon": "14.941319",
 *   "city": {
 *       "id": 192,
 *       "name": "Działoszyn",
 *       "commune": {
 *           "communeName": "Bogatynia",
 *           "districtName": "zgorzelecki",
 *           "provinceName": "DOLNOŚLĄSKIE"
 *       }
 *   },
 *   "addressStreet": null
 * }]
 */
export declare type MeasurementStationRaw = {
    id: number;
    stationName: string;
    gegrLat: string;
    gegrLon: string;
    city: {
        id: number;
        name: string;
        commune: {
            communeName: string;
            distrctName: string;
            provinceName: string;
        };
    };
    addressStreet: string | null;
};
