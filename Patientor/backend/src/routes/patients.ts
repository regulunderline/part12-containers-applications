import express from 'express';
import { Response, Request, NextFunction } from 'express';
import { NewPatient, NonSensitivePatient, Patient, EntryWithoutId, Entry } from "../types";
import { toNewPatient, toNewEntry } from '../utils';

import patientsService from '../services/patientsService';
import entryService from '../services/entryService';


const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientsService.getNonSensitivePatients());
});

router.get('/:id', (req, res: Response<Patient>) => {
  res.send(patientsService.getOnePatient(req.params.id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    toNewPatient(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    toNewEntry(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if(error instanceof Error){
    error.message === 'patient not found' ? res.status(404) : res.status(400)
    res.send( error.message );
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientsService.addPatient(req.body);
  res.json(addedPatient);
});

router.post(
  '/:id/entries', 
  newEntryParser, 
  (req: Request<{ id: string}, unknown, EntryWithoutId>, res: Response<Entry>) => {
    const patient = patientsService.getOnePatient(req.params.id)
    const addedEntry = entryService.addEntry(req.body, patient);
    res.json(addedEntry);
  }
);

router.use(errorMiddleware);

export default router;