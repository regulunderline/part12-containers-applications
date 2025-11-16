import express from 'express';
import { Response } from 'express';
import { Diagnosis } from "../types";

import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis!');
});

export default router;