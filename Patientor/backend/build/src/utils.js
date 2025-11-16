"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatient = exports.parseEntries = void 0;
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isGender = (param) => {
    return Object.values(types_1.Gender).map(g => g.toString()).includes(param);
};
const parseName = (name) => {
    if (!isString(name) || name.length < 2) {
        throw new Error('Incorrect or missing name: ' + name);
    }
    return name;
};
const parseOccupation = (occupation) => {
    if (!isString(occupation) || occupation.length < 3) {
        throw new Error('Incorrect or missing occupation: ' + occupation);
    }
    return occupation;
};
const parseSsn = (ssn) => {
    if (!isString(ssn) || ssn.length < 1) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};
const parseDate = (date, description) => {
    if (!isString(date) || !isDate(date)) {
        throw new Error(`Incorrect or missing ${description}: ${date}`);
    }
    return date;
};
const parseGender = (gender) => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};
const parseEntries = (entries) => {
    if (!Array.isArray(entries) || entries.some(entry => !(typeof entry === 'object'
        && 'type' in entry
        && (entry.type === 'Hospital'
            || entry.type === 'HealthCheck'
            || entry.type === 'OccupationalHealthcare')))) {
        throw new Error('invalid entries');
    }
    return entries;
};
exports.parseEntries = parseEntries;
const parseDescription = (description) => {
    if (!isString(description) || description.length < 3) {
        throw new Error(`Incorrect or missing description: ${description}`);
    }
    return description;
};
const parseSpecialist = (specialist) => {
    if (!isString(specialist) || specialist.length < 3) {
        throw new Error(`Incorrect or missing specialist: ${specialist}`);
    }
    return specialist;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [];
    }
    return object.diagnosisCodes;
};
const parseHealthCheckRating = (rating) => {
    if (!(typeof rating === 'number') || !Object.values(types_1.HealthCheckRating).includes(rating)) {
        throw new Error('Incorrect or missing rating: ' + rating);
    }
    return rating;
};
const parseCriteria = (criteria) => {
    if (!isString(criteria) || criteria.length < 3) {
        throw new Error(`Incorrect or missing discharge criteria: ${criteria}`);
    }
    return criteria;
};
const parseDischarge = (discharge) => {
    if ((!discharge || typeof discharge !== 'object')) {
        throw new Error(`Incorrect or missing discharge`);
    }
    if (!('date' in discharge)) {
        throw new Error(`missing discharge date`);
    }
    if (!('criteria' in discharge)) {
        throw new Error(`missing discharge criteria`);
    }
    return { date: parseDate(discharge.date, 'date of discharge'), criteria: parseCriteria(discharge.criteria) };
};
const parseEmployerName = (name) => {
    if (!isString(name) || name.length < 1) {
        throw new Error(`Incorrect or missing employer name: ${name}`);
    }
    return name;
};
const parseSickLeave = (sickLeave) => {
    if (!sickLeave || typeof sickLeave !== 'object') {
        throw new Error(`Incorrect or missing sick leave`);
    }
    if (!('startDate' in sickLeave)) {
        throw new Error(`missing sick leave start date`);
    }
    if (!('endDate' in sickLeave)) {
        throw new Error(`missing sick leave end date`);
    }
    return { startDate: parseDate(sickLeave.startDate, 'start date of sick leave'), endDate: parseDate(sickLeave.endDate, 'end date of sick leave') };
};
const toNewPatient = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('name' in object
        && 'dateOfBirth' in object
        && 'gender' in object
        && 'occupation' in object
        && 'ssn' in object) {
        const newPatient = {
            name: parseName(object.name),
            gender: parseGender(object.gender),
            dateOfBirth: parseDate(object.dateOfBirth, 'date of birth'),
            occupation: parseOccupation(object.occupation),
            ssn: parseSsn(object.ssn)
        };
        return newPatient;
    }
    throw new Error('Incorrect data: some fields are missing');
};
exports.toNewPatient = toNewPatient;
const toNewEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('description' in object
        && 'date' in object
        && 'specialist' in object
        && 'type' in object) {
        const newEntryBase = {
            description: parseDescription(object.description),
            date: parseDate(object.date, 'date of entry'),
            specialist: parseSpecialist(object.specialist),
        };
        if ('diagnosisCodes' in object) {
            newEntryBase.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        switch (object.type) {
            case 'HealthCheck':
                if ('healthCheckRating' in object) {
                    const newEntry = Object.assign(Object.assign({}, newEntryBase), { healthCheckRating: parseHealthCheckRating(object.healthCheckRating), type: 'HealthCheck' });
                    return newEntry;
                }
                else {
                    throw new Error('Incorrect data: health check rating is missing');
                }
            case 'Hospital':
                if ('discharge' in object) {
                    const newEntry = Object.assign(Object.assign({}, newEntryBase), { discharge: parseDischarge(object.discharge), type: 'Hospital' });
                    return newEntry;
                }
                else {
                    throw new Error('Incorrect data: discharge is missing');
                }
            case 'OccupationalHealthcare':
                if ('employerName' in object) {
                    const newEntry = Object.assign(Object.assign({}, newEntryBase), { employerName: parseEmployerName(object.employerName), type: 'OccupationalHealthcare' });
                    if ('sickLeave' in object) {
                        newEntry.sickLeave = parseSickLeave(object.sickLeave);
                    }
                    return newEntry;
                }
                else {
                    throw new Error('Incorrect data: employer name is missing');
                }
            default:
                throw new Error('Incorrect data: unknown type of entry');
        }
    }
    throw new Error('Incorrect data: some fields are missing');
};
exports.toNewEntry = toNewEntry;
