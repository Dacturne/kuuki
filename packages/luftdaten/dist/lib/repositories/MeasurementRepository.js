"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CQLRepository_1 = require("./CQLRepository");
class MeasurementRepository extends CQLRepository_1.CQLRepository {
    constructor(dbClient) {
        super();
    }
    find(key) {
        throw new Error("Method not implemented.");
    }
    create(item) {
        throw new Error("Method not implemented.");
    }
    exists(key) {
        throw new Error("Method not implemented.");
    }
    update(key, item) {
        throw new Error("Method not implemented.");
    }
    delete(key) {
        throw new Error("Method not implemented.");
    }
}
exports.MeasurementRepository = MeasurementRepository;
//# sourceMappingURL=MeasurementRepository.js.map