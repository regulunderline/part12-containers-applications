import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses';
import { type Diagnosis, type PatientWithEntries, type Entry } from '../types';
import EntryDetails from './EntryDetail/EntryDetail';
import { Box } from '@mui/material';
import HealthCheckForm from './EntryForms/HealthCheckForm';
import HospitalForm from './EntryForms/HospitalForm';
import OccupationalHealthcareForm from './EntryForms/OccupationalHealthcareForm';

const PatientPage = () => {
  const [patient, setPatient] = useState<PatientWithEntries | null >(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchPatient = async () => {
      const patient = await patientService.getOne(id);
      setPatient(patient);
    };
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  if (!patient || !diagnoses){
    return <div>loading patient...</div>;
  }

  const addedEntry = (entry: Entry) => {
    const updatedPatient ={
      ...patient,
      entries: patient.entries.concat(entry)
    };
    setPatient(updatedPatient);
  };

  return (
    <div>
      <h2>{patient.name} {patient.gender}</h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <HealthCheckForm 
        diagnosisCodes={diagnoses.map(diagnose => diagnose.code)} 
        id={patient.id}
        addedEntry={addedEntry}
      />
      <HospitalForm
        diagnosisCodes={diagnoses.map(diagnose => diagnose.code)} 
        id={patient.id}
        addedEntry={addedEntry}
      />
      <OccupationalHealthcareForm
        diagnosisCodes={diagnoses.map(diagnose => diagnose.code)} 
        id={patient.id}
        addedEntry={addedEntry}
      />
      <h3>entries</h3>
      {patient.entries.map(entry => 
        <Box sx={{ p: 2, border: '1px solid grey' }} key={entry.id}>
          {entry.date} {entry.description}
          <ul>
            {entry.diagnosisCodes && entry.diagnosisCodes.map((code, index) => 
              <li key={index}>
                {code}&nbsp;
                {
                  diagnoses.some(diagnose => diagnose.code === code)
                  && diagnoses.find(diagnose => diagnose.code === code)!.name
                }
              </li>
            )}
          </ul>
          <EntryDetails entry={entry}/>
          diagnose by: {entry.specialist}
        </Box>
      )}
    </div>
  );
};

export default PatientPage;