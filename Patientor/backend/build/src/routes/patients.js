"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const patientsService_1 = __importDefault(require("../services/patientsService"));
const entryService_1 = __importDefault(require("../services/entryService"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.send(patientsService_1.default.getNonSensitivePatients());
});
router.get('/:id', (req, res) => {
    res.send(patientsService_1.default.getOnePatient(req.params.id));
});
const newPatientParser = (req, _res, next) => {
    try {
        (0, utils_1.toNewPatient)(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const newEntryParser = (req, _res, next) => {
    try {
        (0, utils_1.toNewEntry)(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const errorMiddleware = (error, _req, res, next) => {
    if (error instanceof Error) {
        error.message === 'patient not found' ? res.status(404) : res.status(400);
        res.send(error.message);
    }
    else {
        next(error);
    }
};
router.post('/', newPatientParser, (req, res) => {
    const addedPatient = patientsService_1.default.addPatient(req.body);
    res.json(addedPatient);
});
router.post('/:id/entries', newEntryParser, (req, res) => {
    const patient = patientsService_1.default.getOnePatient(req.params.id);
    const addedEntry = entryService_1.default.addEntry(req.body, patient);
    res.json(addedEntry);
});
router.use(errorMiddleware);
exports.default = router;
