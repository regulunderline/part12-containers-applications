import { v1 as uuid } from 'uuid';

import { EntryWithoutId, Entry, Patient } from '../types';

const addEntry = ( entry: EntryWithoutId, patient: Patient): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  addEntry
};