import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatient } from '../types';

const getPatients = () : Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...patient }) => patient);
};

const getOnePatient = (id: string): Patient => {
  const patient = patients.find(patient => patient.id === id)
  if (!patient) {
    throw new Error('patient not found');
  }
  return patient;
};

const addPatient = ( patient: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getOnePatient,
  addPatient
};